import Webgl2Base from "../webgl2_base.js";
import CoordinateSystem from "../../instance/coordinateSystem.js";
import webGLManager from "../../webGLManager.js";
import * as utils from "../../../utils/exports.js";
/**基于webGL2的坐标系组件 */
export class WebGL2CoordinateSystem extends CoordinateSystem {
    constructor() {
        super();
        this.initGLData();
    }
    initGLData() {
        this.webGlBaseShader = new Webgl2Base(this.getGL());
        let arr = [];
        let width = 1000;
        let meshCount = 20;
        for (let i = 0; i <= meshCount; i++) {
            let posX = i * (width / meshCount) - (width >> 1);
            arr.push(posX);
            arr.push(0);
            arr.push(-(width >> 1));
            arr.push(posX);
            arr.push(0);
            arr.push(width >> 1);
            let posZ = posX;
            arr.push(-(width >> 1));
            arr.push(0);
            arr.push(posZ);
            arr.push(width >> 1);
            arr.push(0);
            arr.push(posZ);
        }
        this.buffData = new Float32Array(arr);
        this.indicesData = new Int16Array([0, 1, 2, 0, 2, 3]);
        // this.buffData = new Float32Array([
        //     -100, 100, -300, 300, 100, -300, 300, 200, -300,
        // ]);
    }
    update() {
        let camera = webGLManager.getCamera();
        let matWorld = makeTranslation(0, 0, 0);
        let matWorld2 = makeTranslation(100, 100, -100);
        this.webGlBaseShader.bindState();
        this.webGlBaseShader.setBufferData(this.buffData);
        // this.webGlBaseShader.setBufferData(this.indicesData, 2);
        this.webGlBaseShader.setUniformAttribute(utils.Mat4.toArray([], camera.matViewProj), matWorld, this.lineColor.glRGBA(), matWorld2);
    }
    draw() {
        this.update();
        this.webGlBaseShader.drawArrayLines();
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
//# sourceMappingURL=webGL2CoordinateSystem.js.map