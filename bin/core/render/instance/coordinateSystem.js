import webGLManager from "../webGLManager.js";
import * as utils from "../../utils/exports.js";
import { BaseRenderableComp } from "../baseRenderableComp.js";
/**坐标系组件 */
export default class CoordinateSystem extends BaseRenderableComp {
    constructor() {
        super();
        this.lineColor = new utils.Color(30, 30, 30, 0.5);
    }
    getGL() {
        return webGLManager.getWebGLRenderingContext();
    }
    draw() {
    }
}
//# sourceMappingURL=coordinateSystem.js.map