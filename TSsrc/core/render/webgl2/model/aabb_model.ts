import { AABB } from "../../../geometry/aabb.js";
import { Mat4 } from "../../../utils/mat4.js";
import { Vec3 } from "../../../utils/vec3.js";
import { BaseNode } from "../instance/baseNode.js";

/**基于AABB包围盒的模型顶点数据 */
export class AABBModel {
    private _verTexData: Float32Array;
    private _indicesData: Int16Array;

    constructor() {
        this._verTexData = new Float32Array(this.vertexCount * this.vertexAttriFloatCount);
        this._indicesData = new Int16Array(36);
        let offset = 0;
        let baseIndex = 0;
        this._indicesData[offset++] = baseIndex;
        this._indicesData[offset++] = baseIndex + 1;
        this._indicesData[offset++] = baseIndex + 1;
        this._indicesData[offset++] = baseIndex + 3;
        this._indicesData[offset++] = baseIndex + 3;
        this._indicesData[offset++] = baseIndex + 2;
        this._indicesData[offset++] = baseIndex + 2;
        this._indicesData[offset++] = baseIndex;

        baseIndex = 4;
        this._indicesData[offset++] = baseIndex;
        this._indicesData[offset++] = baseIndex + 1;
        this._indicesData[offset++] = baseIndex + 1;
        this._indicesData[offset++] = baseIndex + 3;
        this._indicesData[offset++] = baseIndex + 3;
        this._indicesData[offset++] = baseIndex + 2;
        this._indicesData[offset++] = baseIndex + 2;
        this._indicesData[offset++] = baseIndex;

        baseIndex = 0;
        this._indicesData[offset++] = baseIndex;
        this._indicesData[offset++] = (baseIndex++) + 4;
        this._indicesData[offset++] = baseIndex;
        this._indicesData[offset++] = (baseIndex++) + 4;
        this._indicesData[offset++] = baseIndex;
        this._indicesData[offset++] = (baseIndex++) + 4;
        this._indicesData[offset++] = baseIndex;
        this._indicesData[offset++] = (baseIndex++) + 4;
    }

    private readonly vertexCount: number = 8;
    private readonly vertexAttriFloatCount: number = 3;

    public updateVertexData(aabb: AABB): boolean {
        let indexOffset = 0;
        let scale = 1.1;
        let tempAABB = aabb.clone();
        tempAABB.halfExtents = new Vec3(aabb.halfExtents.x * scale, aabb.halfExtents.y * scale, aabb.halfExtents.z * scale);
        for (let j = 0; j < 8; j++) {
            let flag = j % 4;
            //顶点位置
            let offsetX = (flag < 2 ? -1 : 1) * tempAABB.halfExtents.x;
            let offsetY = (flag % 2 === 0 ? -1 : 1) * tempAABB.halfExtents.y;
            let offsetZ = (j < 4 ? 1 : -1) * tempAABB.halfExtents.z;
            this._verTexData[indexOffset++] = tempAABB.center.x + offsetX;
            this._verTexData[indexOffset++] = tempAABB.center.y + offsetY;
            this._verTexData[indexOffset++] = tempAABB.center.z + offsetZ;
        }
        return true;
    }

    /**获取顶点数据数组（只截取有效数据所处位置的subArray） */
    public getVertexData(): Float32Array {
        return this._verTexData.slice(0, this.vertexCount * this.vertexAttriFloatCount);
    }

    /**获取索引数据数组（只截取有效数据所处位置的subArray） */
    public getIndicesData(): Int16Array {
        return this._indicesData.slice(0, 24);
    }
}