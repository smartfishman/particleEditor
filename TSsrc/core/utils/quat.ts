import { IMat4Like } from "./mat4";
import * as utils from "../utils/exports.js";
import { IVec3Like } from "./vec3";

export class Quat {
    /**
     * @zh 设置四元数值
     */
    public static set<Out extends IQuatLike> (out: Out, x: number, y: number, z: number, w: number) {
        out.x = x;
        out.y = y;
        out.z = z;
        out.w = w;
        return out;
    }

    /**
     * @zh 四元数求逆
     */
    public static invert<Out extends IQuatLike, QuatLike extends IQuatLike> (out: Out, a: QuatLike) {
        const dot = a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w;
        const invDot = dot ? 1.0 / dot : 0;

        // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

        out.x = -a.x * invDot;
        out.y = -a.y * invDot;
        out.z = -a.z * invDot;
        out.w = a.w * invDot;
        return out;
    }

    /**
     * @zh 四元数乘法
     */
    public static multiply<Out extends IQuatLike, QuatLike_1 extends IQuatLike, QuatLike_2 extends IQuatLike>(out: Out, a: QuatLike_1, b: QuatLike_2) {
        const x = a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y;
        const y = a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z;
        const z = a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x;
        const w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
        out.x = x;
        out.y = y;
        out.z = z;
        out.w = w;
        return out;
    }

    /**
     * @zh 根据欧拉角信息计算四元数，旋转顺序为 YZX
     */
    public static fromEuler<Out extends IQuatLike> (out: Out, x: number, y: number, z: number) {
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;

        const sx = Math.sin(x);
        const cx = Math.cos(x);
        const sy = Math.sin(y);
        const cy = Math.cos(y);
        const sz = Math.sin(z);
        const cz = Math.cos(z);

        out.x = sx * cy * cz + cx * sy * sz;
        out.y = cx * sy * cz + sx * cy * sz;
        out.z = cx * cy * sz - sx * sy * cz;
        out.w = cx * cy * cz - sx * sy * sz;

        return out;
    }

    /**
     * @zh 根据旋转、位移、缩放信息计算矩阵，以 S->R->T 的顺序应用
     */
    public static fromRTS <Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike) {
        const x = q.x, y = q.y, z = q.z, w = q.w;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;

        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        const sx = s.x;
        const sy = s.y;
        const sz = s.z;

        out.m00 = (1 - (yy + zz)) * sx;
        out.m01 = (xy + wz) * sx;
        out.m02 = (xz - wy) * sx;
        out.m03 = 0;
        out.m04 = (xy - wz) * sy;
        out.m05 = (1 - (xx + zz)) * sy;
        out.m06 = (yz + wx) * sy;
        out.m07 = 0;
        out.m08 = (xz + wy) * sz;
        out.m09 = (yz - wx) * sz;
        out.m10 = (1 - (xx + yy)) * sz;
        out.m11 = 0;
        out.m12 = v.x;
        out.m13 = v.y;
        out.m14 = v.z;
        out.m15 = 1;

        return out;
    }

    /**
     * @zh 归一化四元数
     */
    public static normalize<Out extends IQuatLike> (out: Out, a: Out) {
        let len = a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = a.x * len;
            out.y = a.y * len;
            out.z = a.z * len;
            out.w = a.w * len;
        }
        return out;
    }

    /**
     * @zh 根据旋转轴和旋转弧度计算四元数
     */
    public static fromAxisAngle<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, axis: VecLike, rad: number) {
        rad = rad * 0.5;
        const s = Math.sin(rad);
        out.x = s * axis.x;
        out.y = s * axis.y;
        out.z = s * axis.z;
        out.w = Math.cos(rad);
        return out;
    }

    /**
     * @zh 绕 X 轴旋转指定四元数
     * @param rad 旋转弧度
     */
    public static rotateX<Out extends IQuatLike> (out: Out, a: Out, rad: number) {
        rad *= 0.5;

        const bx = Math.sin(rad);
        const bw = Math.cos(rad);
        const { x, y, z, w } = a;

        out.x = x * bw + w * bx;
        out.y = y * bw + z * bx;
        out.z = z * bw - y * bx;
        out.w = w * bw - x * bx;
        return out;
    }

    /**
     * 反向旋转，测试下效果
     */
     public static rotateX2<Out extends IQuatLike> (out: Out, a: Out, rad: number) {
        rad *= 0.5;

        const bx = Math.sin(rad);
        const bw = Math.cos(rad);
        const { x, y, z, w } = a;

        out.x = x * bw + w * bx;
        out.y = y * bw - z * bx;
        out.z = z * bw + y * bx;
        out.w = w * bw - x * bx;
        return out;
    }

    /**
     * @zh 绕 Y 轴旋转指定四元数
     * @param rad 旋转弧度
     */
    public static rotateY<Out extends IQuatLike> (out: Out, a: Out, rad: number) {
        rad *= 0.5;

        const by = Math.sin(rad);
        const bw = Math.cos(rad);
        const { x, y, z, w } = a;

        out.x = x * bw - z * by;
        out.y = y * bw + w * by;
        out.z = z * bw + x * by;
        out.w = w * bw - y * by;
        return out;
    }

    /**
     * @zh 绕 Z 轴旋转指定四元数
     * @param rad 旋转弧度
     */
    public static rotateZ<Out extends IQuatLike> (out: Out, a: Out, rad: number) {
        rad *= 0.5;

        const bz = Math.sin(rad);
        const bw = Math.cos(rad);
        const { x, y, z, w } = a;

        out.x = x * bw + y * bz;
        out.y = y * bw - x * bz;
        out.z = z * bw + w * bz;
        out.w = w * bw - z * bz;
        return out;
    }

    /**
     * @en Sets the out quaternion to represent a radian rotation around a given rotation axis in world space
     * @zh 绕世界空间下指定轴旋转四元数
     * @param axis axis of rotation, normalized by default
     * @param rad radius of rotation
     */
    public static rotateAround<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, rot: Out, axis: VecLike, rad: number) {
        // get inv-axis (local to rot)
        Quat.invert(qt_1, rot);
        utils.Vec3.transformQuat(v3_1, axis, qt_1);
        // rotate by inv-axis
        Quat.fromAxisAngle(qt_1, v3_1, rad);
        Quat.multiply(out, rot, qt_1);
        return out;
    }

    /**
     * 测试效果用
     */
    public static rotateAround2<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, rot: Out, axis: VecLike, rad: number) {
        Quat.fromAxisAngle(qt_1, axis, rad);
        Quat.multiply(out, qt_1,rot );
        return out;
    }

    /**
     * x 分量。
     */
    public declare x: number;

    /**
     * y 分量。
     */
    public declare y: number;

    /**
     * z 分量。
     */
    public declare z: number;

    /**
     * w 分量。
     */
    public declare w: number;

    constructor(other: Quat);

    constructor(x?: number, y?: number, z?: number, w?: number);

    constructor(x?: number | IQuatLike, y?: number, z?: number, w?: number) {
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        } else {
            this.x = x as number || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w ?? 1;
        }
    }

    /**
     * @zh 克隆当前四元数。
     */
    public clone() {
        return new Quat(this.x, this.y, this.z, this.w);
    }

    /**
     * @zh 设置当前四元数使其与指定四元数相等。
     * @param other 相比较的四元数。
     * @returns `this`
     */
    public set(other: Quat): Quat;

    /**
     * @zh 设置当前四元数指定元素值。
     * @param x 四元数 x 元素值
     * @param y 四元数 y 元素值
     * @param z 四元数 z 元素值
     * @param w 四元数 w 元素值
     * @returns `this`
     */
    public set(x?: number, y?: number, z?: number, w?: number): Quat;

    public set(x?: number | Quat, y?: number, z?: number, w?: number) {
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        } else {
            this.x = x as number || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w ?? 1;
        }
        return this;
    }
}

export interface IQuatLike {
    x: number;
    y: number;
    z: number;
    w: number;
}

const qt_1 = new Quat();
const v3_1 = new utils.Vec3();
const halfToRad = 0.5 * Math.PI / 180.0;