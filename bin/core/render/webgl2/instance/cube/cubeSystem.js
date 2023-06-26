import { Vec3 } from "../../../../utils/exports.js";
import { BaseNode } from "../baseNode.js";
import { CubeModel } from "../../model/cube_model.js";
import Webgl2Cube from "../../shader/webgl2_cube.js";
import { BaseRenderableComp } from "../../../baseRenderableComp.js";
import { AABB } from "../../../../geometry/aabb.js";
export class Webgl2CubeSystem extends BaseRenderableComp {
    constructor() {
        super();
        this._imageWidth = 1000;
        this.webgl2CubeShader = new Webgl2Cube(this.getGL());
        this.node = new BaseNode();
        this.node.width = 100;
        this.node.position = new Vec3(0, 0, 0);
        this.model = new CubeModel();
        this.initImage();
    }
    update(dt) {
        super.update(dt);
        this.model.updateVertexData(this.node);
        this.updateImage(dt);
        this.webgl2CubeShader.setImageData(this._image);
    }
    draw() {
        super.draw();
        let matWorld = makeTranslation(this.node.position.x, this.node.position.y, this.node.position.z);
        let twoMatWorlds = makeTranslation(this.node.position.x, this.node.position.y, this.node.position.z - 200);
        twoMatWorlds = twoMatWorlds.concat(matWorld);
        this.webgl2CubeShader.bindState();
        this.webgl2CubeShader.setBufferData(this.model.getVertexData());
        this.webgl2CubeShader.setBufferData(this.model.getIndicesData(), 2);
        this.webgl2CubeShader.setBufferData(new Float32Array(matWorld), 3);
        this.webgl2CubeShader.drawElementInstance(1);
    }
    getAABB() {
        if (!this._AABB) {
            this._AABB = new AABB();
        }
        this._AABB.center = this.node.position;
        this._AABB.halfExtents = new Vec3(this.node.width / 2 + 5, this.node.width / 2 + 5, this.node.width / 2 + 5);
        return this._AABB;
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
    updateImage(dt) {
        // let penColor = new Color(255, 255, 255, 1);
        // for (let i = 0; i < this._imageWidth; i++) {
        //     let x = i;
        //     let y = Math.sin(Math.PI * 2 * x / this._imageWidth) * (this._imageWidth / 4) + (this._imageWidth / 2);
        //     updateClampedArrayData(x / this._imageWidth, (this._imageWidth - y) / this._imageWidth, penColor, this._imageCfg);
        // }
        // this._image = new ImageData(this._imageCfg, this._imageWidth, this._imageWidth);
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
/**
 * @param x 0-1
 * @param y 0-1
 */
function updateClampedArrayData(x, y, value, arr) {
    let width = Math.ceil(Math.sqrt(arr.length / 4));
    let height = width;
    let posX = Math.ceil(width * x);
    let posY = Math.ceil(height * y);
    arr[(width * posY + posX) * 4 + 0] = value.R;
    arr[(width * posY + posX) * 4 + 1] = value.G;
    arr[(width * posY + posX) * 4 + 2] = value.B;
    arr[(width * posY + posX) * 4 + 3] = value.A * 255;
}
//# sourceMappingURL=cubeSystem.js.map