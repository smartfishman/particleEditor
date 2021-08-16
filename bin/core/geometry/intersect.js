import { Vec3 } from "../utils/exports.js";
/**
 * @en
 * ray-aabb intersect detect.
 * @zh
 * 射线和轴对齐包围盒的相交性检测。
 * @param {Ray} ray 射线
 * @param {AABB} aabb 轴对齐包围盒
 * @return {number} 0 或 非0
 */
const rayAABB = (function () {
    const min = new Vec3();
    const max = new Vec3();
    return function (ray, aabb) {
        Vec3.subtract(min, aabb.center, aabb.halfExtents);
        Vec3.add(max, aabb.center, aabb.halfExtents);
        return rayAABB2(ray, min, max);
    };
}());
/**
 * tmin 近平面中所有交点的最大值
 * tmax 远平面中所有交点中的最小值
 * 当tmin大于tmax时，则不相交
 * 当相交时，需额外判断下方向。当tmax小于0时，则不相交
 */
function rayAABB2(ray, min, max) {
    const o = ray.o;
    const d = ray.d;
    const ix = 1 / d.x;
    const iy = 1 / d.y;
    const iz = 1 / d.z;
    const t1 = (min.x - o.x) * ix;
    const t2 = (max.x - o.x) * ix;
    const t3 = (min.y - o.y) * iy;
    const t4 = (max.y - o.y) * iy;
    const t5 = (min.z - o.z) * iz;
    const t6 = (max.z - o.z) * iz;
    const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
    const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
    if (tmax < 0 || tmin > tmax) {
        return 0;
    }
    return tmin > 0 ? tmin : tmax; // ray origin inside aabb
}
export let intersect = {
    rayAABB: rayAABB,
};
//# sourceMappingURL=intersect.js.map