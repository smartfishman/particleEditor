import { timeManager } from "../../../utils/timeManager.js";
import { Particle } from "../instance/particle/particle.js";
export class ParticleBatchModel {
    constructor(maxParticleCount) {
        this.maxParticleCount = 100;
        /**四个顶点组成的矩形区域表示一个粒子 */
        this.vertexCount = 4;
        this.vertexAttriFloatCount = 19;
        this.createTimeOffset = 12;
        this.lifeTimeOffset = 11;
        this.curParticleCount = 0;
        this.maxParticleCount = maxParticleCount;
        this._verTexData = new Float32Array(maxParticleCount * this.vertexCount * this.vertexAttriFloatCount);
        this._indicesData = new Int16Array(maxParticleCount * 6);
        let offset = 0;
        for (let j = 0; j < maxParticleCount; j++) {
            let baseIndex = j * this.vertexCount;
            this._indicesData[offset++] = baseIndex;
            this._indicesData[offset++] = baseIndex + 1;
            this._indicesData[offset++] = baseIndex + 2;
            this._indicesData[offset++] = baseIndex + 1;
            this._indicesData[offset++] = baseIndex + 2;
            this._indicesData[offset++] = baseIndex + 3;
        }
    }
    addParticleVertexData(particle) {
        if (this.curParticleCount >= this.maxParticleCount) {
            return false;
        }
        let indexOffset = this.curParticleCount * this.vertexCount * this.vertexAttriFloatCount;
        let texCoordDic = [0, 1];
        for (let j = 0; j < this.vertexCount; j++) {
            //本地初始顶点位置
            let offsetX = (j < 2 ? -1 : 1) * particle.width >> 1;
            let offsetY = (j % 2 === 0 ? -1 : 1) * particle.height >> 1;
            this._verTexData[indexOffset++] = offsetX;
            this._verTexData[indexOffset++] = offsetY;
            this._verTexData[indexOffset++] = 0;
            //纹理坐标
            let texCoordXIndex = j < 2 ? 0 : 1;
            let texCoordYIndex = j % 2 === 0 ? 0 : 1;
            this._verTexData[indexOffset++] = texCoordDic[texCoordXIndex];
            this._verTexData[indexOffset++] = texCoordDic[texCoordYIndex];
            //初速度
            this._verTexData[indexOffset++] = particle.initialVelocity.x;
            this._verTexData[indexOffset++] = particle.initialVelocity.y;
            this._verTexData[indexOffset++] = particle.initialVelocity.z;
            //加速度
            this._verTexData[indexOffset++] = particle.acceleratedVelocity.x;
            this._verTexData[indexOffset++] = particle.acceleratedVelocity.y;
            this._verTexData[indexOffset++] = particle.acceleratedVelocity.z;
            //生存周期
            this._verTexData[indexOffset++] = particle.lifeTime;
            //出生时间
            this._verTexData[indexOffset++] = particle.createTime;
            //初始旋转速度
            this._verTexData[indexOffset++] = particle.initialRotationRate;
            //旋转速度波动范围
            this._verTexData[indexOffset++] = particle.rotationRateRange;
            //随机种子
            this._verTexData[indexOffset++] = particle.randomSeed;
            //世界坐标
            this._verTexData[indexOffset++] = particle.position.x;
            this._verTexData[indexOffset++] = particle.position.y;
            this._verTexData[indexOffset++] = particle.position.z;
        }
        this.curParticleCount++;
        return true;
    }
    /**检查生命周期，删除失效粒子,返回当前粒子数量 */
    updateParticles() {
        const size = this.vertexCount * this.vertexAttriFloatCount;
        let totalCount = this.curParticleCount;
        let nowTime = timeManager.getTime();
        for (let index = 0; index < totalCount; index++) {
            let nowBaseOffset = index * size;
            let createTime = this._verTexData[index * this.vertexCount * this.vertexAttriFloatCount + this.createTimeOffset];
            let lifeTime = this._verTexData[index * this.vertexCount * this.vertexAttriFloatCount + this.lifeTimeOffset];
            if (nowTime - createTime > lifeTime) {
                let lastBaseOffset = --totalCount * size;
                this._verTexData.copyWithin(nowBaseOffset, lastBaseOffset, lastBaseOffset + size);
                index--;
            }
        }
        this.curParticleCount = totalCount;
        return totalCount;
    }
    /**获取顶点数据数组（只截取有效数据所处位置的subArray） */
    getVertexData() {
        return this._verTexData.slice(0, this.curParticleCount * this.vertexCount * this.vertexAttriFloatCount);
    }
    /**获取索引数据数组（只截取有效数据所处位置的subArray） */
    getIndicesData() {
        return this._indicesData.slice(0, this.curParticleCount * 6);
    }
    getFreeParticle() {
        if (!this._tempParticle) {
            this._tempParticle = new Particle();
        }
        return this._tempParticle;
    }
}
//# sourceMappingURL=particle_batch_model.js.map