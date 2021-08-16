import Webgl2Base from "../../shader/webgl2_base.js"
import webGLManager from "../../../webGLManager.js";
import * as utils from "../../../../utils/exports.js";
import { BaseRenderableComp, RENDERABLE_COMP_TYPE } from "../../../baseRenderableComp.js";

/**测试帧缓存输出 */
export class WebGL2TestFrameBufferSystem extends BaseRenderableComp {
    private _verTexData: Float32Array;
    private indicesData: Int16Array;

    private webGlBaseShader: Webgl2Base;

    constructor() {
        super(RENDERABLE_COMP_TYPE.NO_RENDER);
        this.initGLData();
    }

    protected initGLData(): void {
        this.webGlBaseShader = new Webgl2Base(this.getGL(), 1);
        this._verTexData = new Float32Array(4 * 5);
        let indexOffset = 0;
        let texCoordDic = [0, 1];
        for (let j = 0; j < 4; j++) {
            //本地初始顶点位置
            let offsetX = (j < 2 ? -1 : 1);
            let offsetY = (j % 2 === 0 ? -1 : 1);
            this._verTexData[indexOffset++] = offsetX;
            this._verTexData[indexOffset++] = offsetY;
            this._verTexData[indexOffset++] = 0;

            //纹理坐标
            let texCoordXIndex = j < 2 ? 0 : 1;
            let texCoordYIndex = j % 2 === 0 ? 0 : 1;
            this._verTexData[indexOffset++] = texCoordDic[texCoordXIndex];
            this._verTexData[indexOffset++] = texCoordDic[texCoordYIndex];
        }

        let indicesArr: number[] = [0, 1, 2, 1, 2, 3];
        this.indicesData = new Int16Array(indicesArr);
    }

    public update(dt?: number): void {
    }

    public draw(): void {
        let matWorld = makeTranslation(0, 0, 0);
        let matWorld2 = makeTranslation(100, 100, -100);
        this.webGlBaseShader.bindState();
        this.webGlBaseShader.setBufferData(this._verTexData);
        this.webGlBaseShader.setBufferData(this.indicesData, 2);
        this.webGlBaseShader.setUniformAttribute(matWorld, matWorld, new utils.Color(30, 30, 30, 0.5).glRGBA(), matWorld2);
        this.webGlBaseShader.drawElementTriangles();
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