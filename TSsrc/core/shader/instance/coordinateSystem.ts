import webGLManager from "../webGLManager.js"
import * as utils from "../../utils/exports.js"

/**坐标系组件 */
export default class CoordinateSystem {
    protected gl: WebGLRenderingContext;

    protected edgeLength: number;
    protected lineWidth: number;

    public lineColor: utils.Color = new utils.Color(30, 30, 30, 0.5);

    constructor() {
    }

    public getGL(): WebGLRenderingContext {
        return webGLManager.getWebGLRenderingContext();
    }

    public draw(): void {

    }
}