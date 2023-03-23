import { Color } from "../../../utils/color.js";
import { BaseNode } from "../instance/baseNode.js";

export class CurveModel {
    private _verTexData: Float32Array;
    private _indicesData: Int16Array;

    constructor() {
        this._verTexData = new Float32Array(this.vertexCount * this.vertexAttriFloatCount);
        this._indicesData = new Int16Array(6);
        let offset = 0;
        let baseIndex = 0;
        this._indicesData[offset++] = baseIndex;
        this._indicesData[offset++] = baseIndex + 1;
        this._indicesData[offset++] = baseIndex + 2;
        this._indicesData[offset++] = baseIndex + 1;
        this._indicesData[offset++] = baseIndex + 2;
        this._indicesData[offset++] = baseIndex + 3;
    }

    private readonly vertexCount: number = 4;
    private readonly vertexAttriFloatCount: number = 6;

    public updateVertexData(node: BaseNode): boolean {
        let indexOffset = 0;
        for (let j = 0; j < 4; j++) {
            let flag = j % 4;
            //顶点位置
            let offsetWidth = node.width >> 1;
            let offsetHeight = node.height >>1;
            let offsetX = (flag < 2 ? -1 : 1) * offsetWidth;
            let offsetZ = (flag % 2 === 0 ? -1 : 1) * offsetHeight;
            let offsetY = 0;
            this._verTexData[indexOffset++] = 0 + offsetX;
            this._verTexData[indexOffset++] = 0 + offsetY;
            this._verTexData[indexOffset++] = 0 + offsetZ;

            //法向量
            this._verTexData[indexOffset++] = 0;
            this._verTexData[indexOffset++] = 0;
            this._verTexData[indexOffset++] = 1;
        }

        return true;
    }

    /**获取顶点数据数组（只截取有效数据所处位置的subArray） */
    public getVertexData(): Float32Array {
        return this._verTexData.slice(0, this.vertexCount * this.vertexAttriFloatCount);
    }

    /**获取索引数据数组（只截取有效数据所处位置的subArray） */
    public getIndicesData(): Int16Array {
        return this._indicesData.slice(0, 6);
    }
}