/**
 * @packageDocumentation
 * @module geometry
 */
import { Mat3, Vec3 } from '../utils/exports.js';
import enums from './enums.js';
const _v3_tmp = new Vec3();
const _v3_tmp2 = new Vec3();
const _v3_tmp3 = new Vec3();
const _v3_tmp4 = new Vec3();
const _m3_tmp = new Mat3();
// https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/
const transform_extent_m4 = (out, extent, m4) => {
    _m3_tmp.m00 = Math.abs(m4.m00);
    _m3_tmp.m01 = Math.abs(m4.m01);
    _m3_tmp.m02 = Math.abs(m4.m02);
    _m3_tmp.m03 = Math.abs(m4.m04);
    _m3_tmp.m04 = Math.abs(m4.m05);
    _m3_tmp.m05 = Math.abs(m4.m06);
    _m3_tmp.m06 = Math.abs(m4.m08);
    _m3_tmp.m07 = Math.abs(m4.m09);
    _m3_tmp.m08 = Math.abs(m4.m10);
    Vec3.transformMat3(out, extent, _m3_tmp);
};
/**
 * @en
 * Basic Geometry: Axis-aligned bounding box, using center and half extents structure.
 * @zh
 * 基础几何  轴对齐包围盒，使用中心点和半长宽高的结构。
 */
export class AABB {
    constructor(px = 0, py = 0, pz = 0, hw = 1, hh = 1, hl = 1) {
        this._type = enums.SHAPE_AABB;
        this.center = new Vec3(px, py, pz);
        this.halfExtents = new Vec3(hw, hh, hl);
    }
    /**
     * @en
     * create a new AABB
     * @zh
     * 创建一个新的 AABB 实例。
     * @param px - AABB 的原点的 X 坐标。
     * @param py - AABB 的原点的 Y 坐标。
     * @param pz - AABB 的原点的 Z 坐标。
     * @param hw - AABB 宽度的一半。
     * @param hh - AABB 高度的一半。
     * @param hl - AABB 长度的一半。
     * @returns 返回新创建的 AABB 实例。
     */
    static create(px, py, pz, hw, hh, hl) {
        return new AABB(px, py, pz, hw, hh, hl);
    }
    /**
     * @en
     * clone a new AABB
     * @zh
     * 克隆一个 AABB。
     * @param a - 克隆的目标。
     * @returns 克隆出的 AABB。
     */
    static clone(a) {
        return new AABB(a.center.x, a.center.y, a.center.z, a.halfExtents.x, a.halfExtents.y, a.halfExtents.z);
    }
    /**
     * @en
     * copy the values from one AABB to another
     * @zh
     * 将从一个 AABB 的值复制到另一个 AABB。
     * @param {AABB} out 接受操作的 AABB。
     * @param {AABB} a 被复制的 AABB。
     * @return {AABB} out 接受操作的 AABB。
     */
    static copy(out, a) {
        Vec3.copy(out.center, a.center);
        Vec3.copy(out.halfExtents, a.halfExtents);
        return out;
    }
    /**
     * @en
     * create a new AABB from two corner points
     * @zh
     * 从两个点创建一个新的 AABB。
     * @param out - 接受操作的 AABB。
     * @param minPos - AABB 的最小点。
     * @param maxPos - AABB 的最大点。
     * @returns {AABB} out 接受操作的 AABB。
     */
    static fromPoints(out, minPos, maxPos) {
        Vec3.add(_v3_tmp, maxPos, minPos);
        Vec3.subtract(_v3_tmp2, maxPos, minPos);
        Vec3.multiplyScalar(out.center, _v3_tmp, 0.5);
        Vec3.multiplyScalar(out.halfExtents, _v3_tmp2, 0.5);
        return out;
    }
    /**
     * @en
     * Set the components of a AABB to the given values
     * @zh
     * 将 AABB 的属性设置为给定的值。
     * @param {AABB} out 接受操作的 AABB。
     * @param px - AABB 的原点的 X 坐标。
     * @param py - AABB 的原点的 Y 坐标。
     * @param pz - AABB 的原点的 Z 坐标。
     * @param hw - AABB 宽度的一半。
     * @param hh - AABB 高度的一半。
     * @param hl - AABB 长度度的一半。
     * @return {AABB} out 接受操作的 AABB。
     */
    static set(out, px, py, pz, hw, hh, hl) {
        Vec3.set(out.center, px, py, pz);
        Vec3.set(out.halfExtents, hw, hh, hl);
        return out;
    }
    /**
     * @en
     * Merge tow AABB.
     * @zh
     * 合并两个 AABB 到 out。
     * @param out 接受操作的 AABB。
     * @param a 输入的 AABB。
     * @param b 输入的 AABB。
     * @returns {AABB} out 接受操作的 AABB。
     */
    static merge(out, a, b) {
        Vec3.subtract(_v3_tmp, a.center, a.halfExtents);
        Vec3.subtract(_v3_tmp2, b.center, b.halfExtents);
        Vec3.add(_v3_tmp3, a.center, a.halfExtents);
        Vec3.add(_v3_tmp4, b.center, b.halfExtents);
        Vec3.max(_v3_tmp4, _v3_tmp3, _v3_tmp4);
        Vec3.min(_v3_tmp3, _v3_tmp, _v3_tmp2);
        return AABB.fromPoints(out, _v3_tmp3, _v3_tmp4);
    }
    /**
     * @en
     * Transform this AABB.
     * @zh
     * 变换一个 AABB 到 out 中。
     * @param out 接受操作的 AABB。
     * @param a 输入的源 AABB。
     * @param matrix 矩阵。
     * @returns {AABB} out 接受操作的 AABB。
     */
    static transform(out, a, matrix) {
        Vec3.transformMat4(out.center, a.center, matrix);
        transform_extent_m4(out.halfExtents, a.halfExtents, matrix);
        return out;
    }
    /**
     * @en
     * Gets the type of the shape.
     * @zh
     * 获取形状的类型。
     */
    get type() {
        return this._type;
    }
    /**
     * @en
     * Get the bounding points of this shape
     * @zh
     * 获取 AABB 的最小点和最大点。
     * @param {Vec3} minPos 最小点。
     * @param {Vec3} maxPos 最大点。
     */
    getBoundary(minPos, maxPos) {
        Vec3.subtract(minPos, this.center, this.halfExtents);
        Vec3.add(maxPos, this.center, this.halfExtents);
    }
    /**
     * @en
     * Transform this shape
     * @zh
     * 将 out 根据这个 AABB 的数据进行变换。
     * @param m 变换的矩阵。
     * @param pos 变换的位置部分。
     * @param rot 变换的旋转部分。
     * @param scale 变换的缩放部分。
     * @param out 变换的目标。
     */
    transform(m, pos, rot, scale, out) {
        Vec3.transformMat4(out.center, this.center, m);
        transform_extent_m4(out.halfExtents, this.halfExtents, m);
    }
    /**
     * @zh
     * 获得克隆。
     * @returns {AABB}
     */
    clone() {
        return AABB.clone(this);
    }
    /**
     * @zh
     * 拷贝对象。
     * @param a 拷贝的目标。
     * @returns {AABB}
     */
    copy(a) {
        return AABB.copy(this, a);
    }
    contain(target) {
        let min = new Vec3();
        let max = new Vec3();
        Vec3.subtract(min, this.center, this.halfExtents);
        Vec3.add(max, this.center, this.halfExtents);
        if (target.x >= min.x && target.x <= max.x) {
            if (target.y >= min.y && target.y <= max.y) {
                if (target.z >= min.z && target.z <= max.z) {
                    return true;
                }
            }
        }
        return false;
    }
}
//# sourceMappingURL=aabb.js.map