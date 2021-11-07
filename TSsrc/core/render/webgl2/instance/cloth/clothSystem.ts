import { AABB } from "../../../../geometry/aabb.js";
import * as utils from "../../../../utils/exports.js"
import { Vec3 } from "../../../../utils/vec3.js";
import { BaseRenderableComp } from "../../../baseRenderableComp.js";
import webGLManager from "../../../webGLManager.js";
import { ClothModel } from "../../model/cloth_model.js";
import Webgl2Cube from "../../shader/webgl2_cube.js";
import { BaseNode } from "../baseNode.js";

export class Webgl2ClothSystem extends BaseRenderableComp {
    private webgl2StandardShader: Webgl2Cube;
    private model: ClothModel;

    constructor() {
        super();
        this.webgl2StandardShader = new Webgl2Cube(this.getGL());
        this.node = new BaseNode();
        this.node.width = 400;
        this.node.position = new Vec3(0, 0, 0);
        this.model = new ClothModel();
        this.model.updateVertexData(this.node);
        this.model.parentComp = this;
    }

    public getGL(): WebGLRenderingContext {
        return webGLManager.getWebGLRenderingContext();
    }

    public update(dt: number): void {
        super.update(dt);
        this.model.updateByForce(dt);
    }

    public draw(): void {
        super.draw();
        let camera = webGLManager.getCamera();
        let matWorld = makeTranslation(this.node.position.x, this.node.position.y, this.node.position.z);
        let twoMatWorlds = makeTranslation(this.node.position.x, this.node.position.y, this.node.position.z - 200);
        twoMatWorlds = twoMatWorlds.concat(matWorld);
        this.webgl2StandardShader.bindState();
        this.webgl2StandardShader.setBufferData(this.model.getVertexData());
        this.webgl2StandardShader.setBufferData(this.model.getIndicesData(), 2);
        this.webgl2StandardShader.setBufferData(new Float32Array(matWorld), 3);
        this.webgl2StandardShader.setUniformAttribute(new Float32Array(utils.Mat4.toArray([], camera.matViewProj)));
        this.webgl2StandardShader.drawElementInstance(1);
        // this.webgl2StandardShader.draw();
    }

    private _AABB: AABB;
    public getAABB(): AABB {
        if (!this._AABB) {
            this._AABB = new AABB();
        }
        this._AABB.center = this.node.position;
        this._AABB.halfExtents = new Vec3(this.node.width / 2, 5, this.node.width / 2);
        return this._AABB;
    }

    public enableForce(): void {
        this.model.enableForceForEveryVertex(new Vec3(0, -10, 0));
    }
}

function makeTranslation(tx, ty, tz): number[] {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1
    ];
}