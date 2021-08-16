/**
 * @en
 * Basic Geometry: ray.
 * @zh
 * 基础几何 射线。
 */

import { IVec3Like, Vec3 } from "../utils/exports.js";
import enums from "./enums.js";

export class Ray {
    /**
    * @en
    * create a new ray
    * @zh
    * 创建一条射线。
    * @param {number} ox 起点的 x 部分。
    * @param {number} oy 起点的 y 部分。
    * @param {number} oz 起点的 z 部分。
    * @param {number} dx 方向的 x 部分。
    * @param {number} dy 方向的 y 部分。
    * @param {number} dz 方向的 z 部分。
    * @return {Ray} 射线。
    */
    public static create(ox = 0, oy = 0, oz = 0, dx = 0, dy = 0, dz = 1): Ray {
        return new Ray(ox, oy, oz, dx, dy, dz);
    }

    /**
     * @en
     * Creates a new ray initialized with values from an existing ray
     * @zh
     * 从一条射线克隆出一条新的射线。
     * @param {Ray} a 克隆的目标。
     * @return {Ray} 克隆出的新对象。
     */
    public static clone(a: Ray): Ray {
        return new Ray(
            a.o.x, a.o.y, a.o.z,
            a.d.x, a.d.y, a.d.z,
        );
    }

    /**
     * @en
     * Copy the values from one ray to another
     * @zh
     * 将从一个 ray 的值复制到另一个 ray。
     * @param {Ray} out 接受操作的 ray。
     * @param {Ray} a 被复制的 ray。
     * @return {Ray} out 接受操作的 ray。
     */
    public static copy(out: Ray, a: Ray): Ray {
        Vec3.copy(out.o, a.o);
        Vec3.copy(out.d, a.d);

        return out;
    }

    /**
     * @en
     * create a ray from two points
     * @zh
     * 用两个点创建一条射线。
     * @param {Ray} out 接受操作的射线。
     * @param {Vec3} origin 射线的起点。
     * @param {Vec3} target 射线上的一点。
     * @return {Ray} out 接受操作的射线。
     */
    public static fromPoints(out: Ray, origin: Vec3, target: Vec3): Ray {
        Vec3.copy(out.o, origin);
        Vec3.normalize(out.d, Vec3.subtract(out.d, target, origin));
        return out;
    }

    /**
     * @en
     * Set the components of a ray to the given values
     * @zh
     * 将给定射线的属性设置为给定的值。
     * @param {Ray} out 接受操作的射线。
     * @param {number} ox 起点的 x 部分。
     * @param {number} oy 起点的 y 部分。
     * @param {number} oz 起点的 z 部分。
     * @param {number} dx 方向的 x 部分。
     * @param {number} dy 方向的 y 部分。
     * @param {number} dz 方向的 z 部分。
     * @return {Ray} out 接受操作的射线。
     */
    public static set(out: Ray, ox: number, oy: number, oz: number, dx: number, dy: number, dz: number): Ray {
        out.o.x = ox;
        out.o.y = oy;
        out.o.z = oz;
        out.d.x = dx;
        out.d.y = dy;
        out.d.z = dz;

        return out;
    }

    /**
     * @en
     * The origin of the ray.
     * @zh
     * 起点。
     */
    public o: Vec3;

    /**
     * @en
     * The direction of the ray.
     * @zh
     * 方向。
     */
    public d: Vec3;

    /**
     * @en
     * Gets the type of the shape.
     * @zh
     * 获取形状的类型。
     */
    get type() {
        return this._type;
    }

    protected readonly _type: number;

    /**
     * @en
     * Construct a ray;
     * @zh
     * 构造一条射线。
     * @param {number} ox 起点的 x 部分。
     * @param {number} oy 起点的 y 部分。
     * @param {number} oz 起点的 z 部分。
     * @param {number} dx 方向的 x 部分。
     * @param {number} dy 方向的 y 部分。
     * @param {number} dz 方向的 z 部分。
     */
    constructor(ox = 0, oy = 0, oz = 0,
        dx = 0, dy = 0, dz = -1) {
        this._type = enums.SHAPE_RAY;
        this.o = new Vec3(ox, oy, oz);
        this.d = new Vec3(dx, dy, dz);
    }

    /**
     * @en
     * Compute a point with the distance between the origin.
     * @zh
     * 根据给定距离计算出射线上的一点。
     * @param out 射线上的另一点。
     * @param distance 给定距离。
     */
    public computeHit(out: IVec3Like, distance: number) {
        Vec3.normalize(out, this.d);
        Vec3.scaleAndAdd(out, this.o, out, distance);
    }
}