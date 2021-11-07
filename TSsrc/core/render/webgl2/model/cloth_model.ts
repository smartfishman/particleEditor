import { renderableCompMgr } from "../../../pool/renderableCompMgr.js";
import { Vec3 } from "../../../utils/vec3.js";
import { BaseRenderableComp, RENDERABLE_COMP_TYPE, RENDERABLE_COMP_TYPES_NORMAL_RENDER } from "../../baseRenderableComp.js";
import { BaseNode } from "../instance/baseNode.js";

export class ClothModel {
    public parentComp: BaseRenderableComp;

    private _verTexData: Float32Array;
    private _indicesData: Int16Array;

    constructor() {
        this._verTexData = new Float32Array(this.vertexCount * this.vertexAttriFloatCount);
        this._indicesData = new Int16Array(this.rowCount * this.rowCount * 6);
        let offset = 0;
        for (let i = 0; i < this.rowCount; i++) {
            for (let j = 0; j < this.rowCount; j++) {
                let baseIndex0 = j + (i * (this.rowCount + 1));
                let baseIndex1 = j + ((i + 1) * (this.rowCount + 1));
                let baseIndex2 = j + 1 + (i * (this.rowCount + 1));
                let baseIndex3 = j + 1 + ((i + 1) * (this.rowCount + 1));
                this._indicesData[offset++] = baseIndex0;
                this._indicesData[offset++] = baseIndex1;
                this._indicesData[offset++] = baseIndex3;
                this._indicesData[offset++] = baseIndex0;
                this._indicesData[offset++] = baseIndex2;
                this._indicesData[offset++] = baseIndex3;
            }
        }
        this.initNode();
    }

    private readonly rowCount: number = 16;
    private readonly vertexCount: number = (this.rowCount + 1) * (this.rowCount + 1);
    private readonly vertexAttriFloatCount: number = 8;
    private readonly positionOffset: number = 0;

    public updateVertexData(node: BaseNode): boolean {
        let indexOffset = 0;
        let cellWidth = node.width >> 4;
        for (let i = 0; i < this.rowCount + 1; i++) {
            for (let k = 0; k < this.rowCount + 1; k++) {
                let baseX = cellWidth * (i - 8);
                let baseZ = cellWidth * (k - 8);
                //顶点位置
                this._verTexData[indexOffset++] = baseX;
                this._verTexData[indexOffset++] = 0;
                this._verTexData[indexOffset++] = baseZ;

                let baseX_Abs = cellWidth * i;
                let baseZ_Abs = cellWidth * k;
                //纹理坐标
                this._verTexData[indexOffset++] = (baseX_Abs) / node.width;
                this._verTexData[indexOffset++] = (baseZ_Abs) / node.width;

                //法向量
                this._verTexData[indexOffset++] = 0;
                this._verTexData[indexOffset++] = 1;
                this._verTexData[indexOffset++] = 0;
            }
        }
        this.initConstrait();
        return true;
    }

    /**获取顶点数据数组（只截取有效数据所处位置的subArray） */
    public getVertexData(): Float32Array {
        return this._verTexData.slice(0, this.vertexCount * this.vertexAttriFloatCount);
    }

    /**获取索引数据数组（只截取有效数据所处位置的subArray） */
    public getIndicesData(): Int16Array {
        return this._indicesData.slice(0, this.rowCount * this.rowCount * 6);
    }


    /**每秒移动量 */
    private _force: Vec3;
    /**存储各个顶点的质量的相反数 */
    private nodeInvMass: number[] = [];
    private nodeMass: number[] = [];
    private nodePredPos: Vec3[] = [];
    private nodeVel: Vec3[] = [];
    private nodeForce: Vec3[] = [];
    private disConstraintList: DistanceConstraint[] = [];

    public enableForceForEveryVertex(force: Vec3): void {
        if (force && force.length() > 0) {
            this._force = force;
        } else {
            this._force = null;
        }

    }

    private initNode(): void {
        for (let i = 0; i < this.vertexCount; i++) {
            this.nodeMass[i] = 10;
            this.nodeInvMass[i] = 1 / 10;
            this.nodeVel[i] = new Vec3(0, 0, 0);
            this.nodePredPos[i] = new Vec3(0, 0, 0);
        }
    }

    private initConstrait(): void {
        this.disConstraintList = [];
        for (let i = 0; i < this.rowCount; i++) {
            for (let j = 0; j < this.rowCount; j++) {
                let index0 = j + (i * (this.rowCount + 1));
                let index1 = j + ((i + 1) * (this.rowCount + 1));
                let index2 = j + 1 + ((i + 1) * (this.rowCount + 1));
                let index3 = j + 1 + (i * (this.rowCount + 1));

                let nodePos0 = new Vec3(
                    this._verTexData[index0 * this.vertexAttriFloatCount + this.positionOffset],
                    this._verTexData[index0 * this.vertexAttriFloatCount + this.positionOffset + 1],
                    this._verTexData[index0 * this.vertexAttriFloatCount + this.positionOffset + 2],
                )
                let nodePos1 = new Vec3(
                    this._verTexData[index1 * this.vertexAttriFloatCount + this.positionOffset],
                    this._verTexData[index1 * this.vertexAttriFloatCount + this.positionOffset + 1],
                    this._verTexData[index1 * this.vertexAttriFloatCount + this.positionOffset + 2],
                )
                let nodePos2 = new Vec3(
                    this._verTexData[index2 * this.vertexAttriFloatCount + this.positionOffset],
                    this._verTexData[index2 * this.vertexAttriFloatCount + this.positionOffset + 1],
                    this._verTexData[index2 * this.vertexAttriFloatCount + this.positionOffset + 2],
                )
                let nodePos3 = new Vec3(
                    this._verTexData[index3 * this.vertexAttriFloatCount + this.positionOffset],
                    this._verTexData[index3 * this.vertexAttriFloatCount + this.positionOffset + 1],
                    this._verTexData[index3 * this.vertexAttriFloatCount + this.positionOffset + 2],
                )

                var tDisConstraint0 = new DistanceConstraint(index0, index1, nodePos0, nodePos1, PARA.kStretch);
                var tDisConstraint1 = new DistanceConstraint(index3, index2, nodePos3, nodePos2, PARA.kStretch);
                var tDisConstraint2 = new DistanceConstraint(index1, index2, nodePos1, nodePos2, PARA.kStretch);
                var tDisConstraint3 = new DistanceConstraint(index0, index3, nodePos0, nodePos3, PARA.kStretch);
                var tDisConstraint4 = new DistanceConstraint(index0, index2, nodePos0, nodePos2, PARA.kStretch);
                var tDisConstraint5 = new DistanceConstraint(index1, index3, nodePos1, nodePos3, PARA.kStretch);

                this.disConstraintList.push(tDisConstraint0);
                this.disConstraintList.push(tDisConstraint1);
                this.disConstraintList.push(tDisConstraint2);
                this.disConstraintList.push(tDisConstraint3);
                this.disConstraintList.push(tDisConstraint4);
                this.disConstraintList.push(tDisConstraint5);
            }
        }
    }

    public updateByForce(dt: number): void {
        if (this._force) {
            this.calculateForce(dt);
            for (let i = 0; i < PARA.numIter; i++) {
                this.updateConstraints();
            }
            this.collisionDetect();
            this.integrate(dt);
        }
    }

    private calculateForce(dt: number): void {
        dt = dt / 1000;
        for (let i = 0; i < this.vertexCount; i++) {
            this.nodeForce[i] = new Vec3(0, 0, 0);
            if (this.nodeInvMass[i] > 0) {
                Vec3.add(this.nodeForce[i], this.nodeForce[i], Vec3.multiplyScalar(new Vec3(), this._force, this.nodeMass[i]));
            }
        }

        for (let i = 0; i < this.vertexCount; i++) {
            Vec3.multiplyScalar(this.nodeVel[i], this.nodeVel[i], PARA.globalDamping);
            let changedVel = Vec3.multiplyScalar(this.nodeForce[i], this.nodeForce[i], this.nodeInvMass[i] * dt);
            Vec3.add(this.nodeVel[i], this.nodeVel[i], changedVel);
        }

        for (let i = 0; i < this.vertexCount; i++) {
            if (this.nodeInvMass[i] <= 0) {
                this.nodePredPos[i].x = this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset];
                this.nodePredPos[i].y = this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset + 1];
                this.nodePredPos[i].z = this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset + 2];
            } else {
                this.nodePredPos[i].x = this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset] + (this.nodeVel[i].x * dt);
                this.nodePredPos[i].y = this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset + 1] + (this.nodeVel[i].y * dt);
                this.nodePredPos[i].z = this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset + 2] + (this.nodeVel[i].z * dt);
            }
        }
    }

    private updateConstraints() {
        for (let i = 0; i < this.disConstraintList.length; i++) {
            let tConstraint = this.disConstraintList[i];
            let index1 = tConstraint.index1;
            let index2 = tConstraint.index2;

            let dirVec = Vec3.subtract(new Vec3(), this.nodePredPos[index1], this.nodePredPos[index2]);
            let len = dirVec.length();

            let w1 = this.nodeInvMass[index1];
            let w2 = this.nodeInvMass[index2];

            let dPLength = (1.0 / (w1 + w2)) * (len - tConstraint.restLength) * tConstraint.kPrime / len;
            let dp = Vec3.multiplyScalar(new Vec3(), dirVec, dPLength);

            if (w1 > 0.0) {
                let vector = Vec3.multiplyScalar(new Vec3(), dp, w1);
                this.nodePredPos[index1] = Vec3.subtract(new Vec3(), this.nodePredPos[index1], vector);
            }

            if (w2 > 0.0) {
                let vector = Vec3.multiplyScalar(new Vec3(), dp, w2);
                this.nodePredPos[index2] = Vec3.add(new Vec3(), this.nodePredPos[index2], vector);
            }

        }
    }

    private collisionDetect() {
        for (let i = 0; i < this.vertexCount; i++) {
            let pos = Vec3.add(new Vec3(), this.parentComp.node.position, this.nodePredPos[i])
            if (renderableCompMgr.checkAnyBoxContainTarget(pos, [this.parentComp])) {
                this.nodePredPos[i].x = this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset];
                this.nodePredPos[i].y = this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset + 1];
                this.nodePredPos[i].z = this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset + 2];
            }
        }
    }

    private integrate(dt: number) {
        dt = dt / 1000;
        for (let i = 0; i < this.vertexCount; i++) {
            this.nodeVel[i].x = (this.nodePredPos[i].x - this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset]) / dt;
            this.nodeVel[i].y = (this.nodePredPos[i].y - this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset + 1]) / dt;
            this.nodeVel[i].z = (this.nodePredPos[i].z - this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset + 2]) / dt;

            this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset] = this.nodePredPos[i].x;
            this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset + 1] = this.nodePredPos[i].y;
            this._verTexData[i * this.vertexAttriFloatCount + this.positionOffset + 2] = this.nodePredPos[i].z;
        }
    }
}

class PARA {
    public static numIter = 1;
    public static kStretch = 0.25;
    public static globalDamping = 0.98;
}

class DistanceConstraint {
    constructor(i1: number, i2: number, position1: Vec3, posiiton2: Vec3, k_: number) {
        this.index1 = i1;
        this.index2 = i2;

        this.pos1 = position1;
        this.pos2 = posiiton2;

        this.restLength = Vec3.subtract(new Vec3(), this.pos1, this.pos2).length();

        this.k = k_;
        this.kPrime = 1.0 - Math.pow((1.0 - this.k), 1.0 / PARA.numIter);
    }

    public index1: number;
    public index2: number;
    public pos1: Vec3;
    public pos2: Vec3;
    public k: number;
    public kPrime: number;
    public restLength: number;
}