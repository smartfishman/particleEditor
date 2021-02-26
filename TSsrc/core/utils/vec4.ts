import { IQuatLike } from "./quat";

/**
 * 四维向量。
 */
export class Vec4  {
    /**
     * @zh 向量四元数乘法
     */
    public static transformQuat <Out extends IVec4Like, QuatLike extends IQuatLike> (out: Out, a: Out, q: QuatLike) {
        const { x, y, z } = a;

        const _x = q.x;
        const _y = q.y;
        const _z = q.z;
        const _w = q.w;

        // calculate quat * vec
        const ix = _w * x + _y * z - _z * y;
        const iy = _w * y + _z * x - _x * z;
        const iz = _w * z + _x * y - _y * x;
        const iw = -_x * x - _y * y - _z * z;

        // calculate result * inverse quat
        out.x = ix * _w + iw * -_x + iy * -_z - iz * -_y;
        out.y = iy * _w + iw * -_y + iz * -_x - ix * -_z;
        out.z = iz * _w + iw * -_z + ix * -_y - iy * -_x;
        out.w = a.w;
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

    constructor (other: Vec4);

    constructor (x?: number, y?: number, z?: number, w?: number);

    constructor (x?: number | Vec4, y?: number, z?: number, w?: number) {
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        } else {
            this.x = x as number || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }
    }

    /**
     * @zh 克隆当前向量。
     */
    public clone () {
        return new Vec4(this.x, this.y, this.z, this.w);
    }

}

export interface IVec4Like {
    x: number;
    y: number;
    z: number;
    w: number;
}