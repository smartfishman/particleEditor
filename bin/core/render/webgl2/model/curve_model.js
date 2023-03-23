export class CurveModel {
    constructor() {
        this.vertexCount = 4;
        this.vertexAttriFloatCount = 6;
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
    updateVertexData(node) {
        let indexOffset = 0;
        for (let j = 0; j < 4; j++) {
            let flag = j % 4;
            //顶点位置
            let offsetWidth = node.width >> 1;
            let offsetHeight = node.height >> 1;
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
    getVertexData() {
        return this._verTexData.slice(0, this.vertexCount * this.vertexAttriFloatCount);
    }
    /**获取索引数据数组（只截取有效数据所处位置的subArray） */
    getIndicesData() {
        return this._indicesData.slice(0, 6);
    }
}
//# sourceMappingURL=curve_model.js.map