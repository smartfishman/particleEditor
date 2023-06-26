import { AABB } from "../../../../geometry/aabb.js";
import { Color } from "../../../../utils/color.js";
import { Mat4 } from "../../../../utils/exports.js";
import { timeManager } from "../../../../utils/timeManager.js";
import Utils from "../../../../utils/utils.js";
import { Vec3 } from "../../../../utils/vec3.js";
import { BaseRenderableComp } from "../../../baseRenderableComp.js";
import webGLManager from "../../../webGLManager.js";
import { CurveModel } from "../../model/curve_model.js";
import Webgl2Curve from "../../shader/webgl2_curve.js";
import { BaseNode } from "../baseNode.js";

export class Webgl2CurveSystem extends BaseRenderableComp {
    private webgl2HeatDiffusionShader: Webgl2Curve;
    private model: CurveModel;
    private subNodes: BaseNode[];
    private modelColors: Color[];

    private subModelCount = 2;

    //热扩散动画的起始时间
    public createTimeForAni:number = 0;

    constructor() {
        super();
        this.webgl2HeatDiffusionShader = new Webgl2Curve(this.getGL());
        this.node = new BaseNode();
        this.node.width = 100;
        this.node.height = 50;
        this.node.position = new Vec3(100, 300, -300);
        this.initSubModel();

        this.createTimeForAni = timeManager.getTime();
    }

    private initSubModel() {
        this.modelColors = [];
        this.subNodes = [];
        let cellWidth = this.node.width / this.subModelCount;
        let cellHeight = this.node.height;

        for (let i = 0; i < this.subModelCount; i++) {
            let offsetX = (-this.node.width / 2) + ((i + 0.5) * cellWidth);
            let subNode = new BaseNode();
            subNode.width = cellWidth;
            subNode.height = cellHeight;
            subNode.position = new Vec3(this.node.position.x + offsetX, this.node.position.y, this.node.position.z);
            this.subNodes.push(subNode);

            let color = new Color(255, 255 * i / this.subModelCount, 0, 1);
            this.modelColors.push(color);
        }
        this.model = new CurveModel();
        this.model.updateVertexData(this.subNodes[0]);
    }

    public updateSubModel() {
        let cellWidth = this.node.width / this.subModelCount;
        let cellHeight = this.node.height;
        for (let i = 0; i < this.subModelCount; i++) {
            let offsetX = (-this.node.width / 2) + ((i + 0.5) * cellWidth);
            this.subNodes[i].width = cellWidth;
            this.subNodes[i].height = cellHeight;
            this.subNodes[i].position = new Vec3(this.node.position.x + offsetX, this.node.position.y, this.node.position.z);
        }
        this.model.updateVertexData(this.subNodes[0])
    }

    public update(dt: number): void {
        super.update(dt);
    }

    public draw() {
        super.draw();
        this.webgl2HeatDiffusionShader.bindState();
        this.webgl2HeatDiffusionShader.setBufferData(this.model.getVertexData());
        this.webgl2HeatDiffusionShader.setBufferData(this.model.getIndicesData(), 2);
        this.webgl2HeatDiffusionShader.setBufferData(this.getInstanceData(), 3);
        this.webgl2HeatDiffusionShader.setUniformAttribute(this.createTimeForAni);
        this.webgl2HeatDiffusionShader.drawElementInstance(this.subModelCount);
    }

    private getInstanceData(): Float32Array {
        let resultArr = [];
        let arrIndex = 0;
        for (let i = 0; i < this.subNodes.length; i++) {
            let position = this.subNodes[i].position;
            let cellArr = Utils.makeTranslation(position.x, position.y, position.z);
            cellArr.push(...this.modelColors[i].glRGB());
            resultArr.push(...cellArr);
            resultArr.push(this.subNodes[0].width);
        }
        return new Float32Array(resultArr);
    }

    private _AABB: AABB;
    public getAABB(): AABB {
        if (!this._AABB) {
            this._AABB = new AABB();
        }
        this._AABB.center = this.node.position;
        this._AABB.halfExtents = new Vec3(this.node.width / 2 + 5,10 , this.node.height / 2 + 5);
        return this._AABB;
    }
}