import webGLManager from "../../../webGLManager.js";
import * as utils from "../../../../utils/exports.js";
import { Vec3 } from "../../../../utils/exports.js";
import { BaseNode } from "../baseNode.js";
import { CubeModel } from "../../model/cube_model.js";
import Webgl2Cube from "../../shader/webgl2_cube.js";
import { BaseRenderableComp } from "../../../baseRenderableComp.js";
import { AABB } from "../../../../geometry/aabb.js";
export class Webgl2CubeSystem extends BaseRenderableComp {
    constructor() {
        super();
        this.webgl2CubeShader = new Webgl2Cube(this.getGL());
        this.node = new BaseNode();
        this.node.width = 100;
        this.node.position = new Vec3(0, 0, 0);
        this.model = new CubeModel();
    }
    getGL() {
        return webGLManager.getWebGLRenderingContext();
    }
    update(dt) {
        super.update(dt);
        this.model.updateVertexData(this.node);
    }
    draw() {
        super.draw();
        let camera = webGLManager.getCamera();
        let matWorld = makeTranslation(0, 0, 0);
        this.webgl2CubeShader.bindState();
        this.webgl2CubeShader.setBufferData(this.model.getVertexData());
        this.webgl2CubeShader.setBufferData(this.model.getIndicesData(), 2);
        this.webgl2CubeShader.setUniformAttribute(new Float32Array(utils.Mat4.toArray([], camera.matViewProj)), new Float32Array(matWorld));
        this.webgl2CubeShader.draw();
    }
    getAABB() {
        if (!this._AABB) {
            this._AABB = new AABB();
        }
        this._AABB.center = this.node.position;
        this._AABB.halfExtents = new Vec3(this.node.width / 2, this.node.width / 2, this.node.width / 2);
        return this._AABB;
    }
}
function makeTranslation(tx, ty, tz) {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1
    ];
}
//# sourceMappingURL=cubeSystem.js.map