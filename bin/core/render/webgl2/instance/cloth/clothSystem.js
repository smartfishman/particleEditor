import { AABB } from "../../../../geometry/aabb.js";
import * as utils from "../../../../utils/exports.js";
import { Vec3 } from "../../../../utils/vec3.js";
import { BaseRenderableComp } from "../../../baseRenderableComp.js";
import webGLManager from "../../../webGLManager.js";
import { ClothModel } from "../../model/cloth_model.js";
import Webgl2Cube from "../../shader/webgl2_cube.js";
import { BaseNode } from "../baseNode.js";
export class Webgl2ClothSystem extends BaseRenderableComp {
    constructor() {
        super();
        this.webgl2StandardShader = new Webgl2Cube(this.getGL());
        this.node = new BaseNode();
        this.node.width = 400;
        this.node.position = new Vec3(0, 0, 0);
        this.model = new ClothModel();
        this.model.updateVertexData(this.node);
        this.model.parentComp = this;
        this.initImage();
    }
    getGL() {
        return webGLManager.getWebGLRenderingContext();
    }
    update(dt) {
        super.update(dt);
        this.model.updateByForce(dt);
        this.webgl2StandardShader.setImageData(this._image);
    }
    draw() {
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
    getAABB() {
        if (!this._AABB) {
            this._AABB = new AABB();
        }
        this._AABB.center = this.node.position;
        this._AABB.halfExtents = new Vec3(this.node.width / 2, 5, this.node.width / 2);
        return this._AABB;
    }
    enableForce() {
        this.model.enableForceForEveryVertex(new Vec3(0, -10, 0));
    }
    initImage() {
        // if (!this._imageCfg) {
        //     this._imageCfg = new Uint8ClampedArray(this._imageWidth * this._imageWidth * 4);
        //     for (let i = 0; i < this._imageWidth * this._imageWidth; i++) {
        //         this._imageCfg[4 * i + 0] = 0;
        //         this._imageCfg[4 * i + 1] = 0;
        //         this._imageCfg[4 * i + 2] = 255;
        //         this._imageCfg[4 * i + 3] = 1;
        //     }
        // }
        // this._image = new ImageData(this._imageCfg, this._imageWidth, this._imageWidth);
        let image = new Image();
        image.src = "http://localhost:3000/images/timg.jpg";
        image.onload = () => {
            this._image = image;
        };
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
//# sourceMappingURL=clothSystem.js.map