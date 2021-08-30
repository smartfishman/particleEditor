export class CubeModel {
    constructor() {
        this.vertexCount = 24;
        this.vertexAttriFloatCount = 8;
        this._verTexData = new Float32Array(this.vertexCount * this.vertexAttriFloatCount);
        this._indicesData = new Int16Array(36);
        let offset = 0;
        for (let j = 0; j < 6; j++) {
            let baseIndex = j * 4;
            this._indicesData[offset++] = baseIndex;
            this._indicesData[offset++] = baseIndex + 1;
            this._indicesData[offset++] = baseIndex + 2;
            this._indicesData[offset++] = baseIndex + 1;
            this._indicesData[offset++] = baseIndex + 2;
            this._indicesData[offset++] = baseIndex + 3;
        }
    }
    updateVertexData(node) {
        let indexOffset = 0;
        let texCoordDic = [0, 1];
        for (let j = 0; j < 8; j++) {
            let flag = j % 4;
            //顶点位置
            let offSetWidth = node.width >> 1;
            let offsetX = (flag < 2 ? -1 : 1) * offSetWidth;
            let offsetY = (flag % 2 === 0 ? -1 : 1) * offSetWidth;
            let offsetZ = (j < 4 ? 1 : -1) * offSetWidth;
            this._verTexData[indexOffset++] = 0 + offsetX;
            this._verTexData[indexOffset++] = 0 + offsetY;
            this._verTexData[indexOffset++] = 0 + offsetZ;
            //纹理坐标
            let texCoordXIndex = flag < 2 ? 0 : 1;
            let texCoordYIndex = flag % 2 === 0 ? 1 : 0;
            this._verTexData[indexOffset++] = texCoordDic[texCoordXIndex];
            this._verTexData[indexOffset++] = texCoordDic[texCoordYIndex];
            //法向量
            this._verTexData[indexOffset++] = 0;
            this._verTexData[indexOffset++] = 0;
            this._verTexData[indexOffset++] = j < 4 ? 1 : -1;
        }
        for (let j = 0; j < 8; j++) {
            let flag = j % 4;
            //顶点位置
            let offSetWidth = node.width >> 1;
            let offsetZ = (flag < 2 ? 1 : -1) * offSetWidth;
            let offsetY = (flag % 2 === 0 ? -1 : 1) * offSetWidth;
            let offsetX = (j < 4 ? -1 : 1) * offSetWidth;
            this._verTexData[indexOffset++] = 0 + offsetX;
            this._verTexData[indexOffset++] = 0 + offsetY;
            this._verTexData[indexOffset++] = 0 + offsetZ;
            //纹理坐标
            let texCoordXIndex = flag < 2 ? 0 : 1;
            let texCoordYIndex = flag % 2 === 0 ? 1 : 0;
            this._verTexData[indexOffset++] = texCoordDic[texCoordXIndex];
            this._verTexData[indexOffset++] = texCoordDic[texCoordYIndex];
            //法向量
            this._verTexData[indexOffset++] = j < 4 ? -1 : 1;
            this._verTexData[indexOffset++] = 0;
            this._verTexData[indexOffset++] = 0;
        }
        for (let j = 0; j < 8; j++) {
            let flag = j % 4;
            //顶点位置
            let offSetWidth = node.width >> 1;
            let offsetX = (flag < 2 ? -1 : 1) * offSetWidth;
            let offsetZ = (flag % 2 === 0 ? 1 : -1) * offSetWidth;
            let offsetY = (j < 4 ? 1 : -1) * offSetWidth;
            this._verTexData[indexOffset++] = 0 + offsetX;
            this._verTexData[indexOffset++] = 0 + offsetY;
            this._verTexData[indexOffset++] = 0 + offsetZ;
            //纹理坐标
            let texCoordXIndex = flag < 2 ? 0 : 1;
            let texCoordYIndex = flag % 2 === 0 ? 1 : 0;
            this._verTexData[indexOffset++] = texCoordDic[texCoordXIndex];
            this._verTexData[indexOffset++] = texCoordDic[texCoordYIndex];
            //法向量
            this._verTexData[indexOffset++] = 0;
            this._verTexData[indexOffset++] = j < 4 ? 1 : -1;
            this._verTexData[indexOffset++] = 0;
        }
        return true;
    }
    /**获取顶点数据数组（只截取有效数据所处位置的subArray） */
    getVertexData() {
        return this._verTexData.slice(0, this.vertexCount * this.vertexAttriFloatCount);
    }
    /**获取索引数据数组（只截取有效数据所处位置的subArray） */
    getIndicesData() {
        return this._indicesData.slice(0, 36);
    }
}
//# sourceMappingURL=cube_model.js.map