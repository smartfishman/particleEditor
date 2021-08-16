import { renderableCompMgr } from "../pool/renderableCompMgr.js";
import { AABBModel } from "./webgl2/model/aabb_model.js";
import Webgl2Base from "./webgl2/shader/webgl2_base.js";
import webGLManager from "./webGLManager.js";
import { makeTranslation } from "./webglUtils.js";
import * as utils from "../utils/exports.js";
export class BaseRenderableComp {
    constructor(type = RENDERABLE_COMP_TYPE.NORMAL) {
        this.compType = RENDERABLE_COMP_TYPE.NORMAL;
        /**是否显示包围盒线框 */
        this.showAABB = false;
        this._lineColor = new utils.Color(255, 255, 255, 0.5);
        this.compType = type;
        renderableCompMgr.registerRenderableComp(this);
        this._aabbShader = new Webgl2Base(this.getGL());
        this._aabbModel = new AABBModel();
    }
    getGL() {
        return webGLManager.getWebGLRenderingContext();
    }
    update(dt) {
        if (this.showAABB) {
            this._aabbModel.updateVertexData(this.getAABB());
        }
    }
    draw() {
        if (this.showAABB) {
            let camera = webGLManager.getCamera();
            let matWorld = makeTranslation(0, 0, 0);
            this._aabbShader.bindState();
            this._aabbShader.setBufferData(this._aabbModel.getVertexData());
            this._aabbShader.setBufferData(this._aabbModel.getIndicesData(), 2);
            this._aabbShader.setUniformAttribute(utils.Mat4.toArray([], camera.matViewProj), matWorld, this._lineColor.glRGBA(), matWorld);
            this._aabbShader.drawElements();
        }
    }
    getAABB() {
        return null;
    }
    destroy() {
        renderableCompMgr.deregisterRenderableComp(this);
    }
}
//TODO 这里的类型应该区分透明对象和不透明对象， 不然颜色混合时无法得到正确的结果。
export var RENDERABLE_COMP_TYPE;
(function (RENDERABLE_COMP_TYPE) {
    RENDERABLE_COMP_TYPE[RENDERABLE_COMP_TYPE["NORMAL"] = 0] = "NORMAL";
    /**不参与常规渲染 */
    RENDERABLE_COMP_TYPE[RENDERABLE_COMP_TYPE["NO_RENDER"] = 1] = "NO_RENDER";
})(RENDERABLE_COMP_TYPE || (RENDERABLE_COMP_TYPE = {}));
export var RENDERABLE_COMP_SYSTEM_TYPE;
(function (RENDERABLE_COMP_SYSTEM_TYPE) {
    RENDERABLE_COMP_SYSTEM_TYPE[RENDERABLE_COMP_SYSTEM_TYPE["COORDINATE_SYSTEM"] = 1] = "COORDINATE_SYSTEM";
    RENDERABLE_COMP_SYSTEM_TYPE[RENDERABLE_COMP_SYSTEM_TYPE["PARTICLE_SYSTEM"] = 2] = "PARTICLE_SYSTEM";
    RENDERABLE_COMP_SYSTEM_TYPE[RENDERABLE_COMP_SYSTEM_TYPE["CUBE_SYSTEM"] = 3] = "CUBE_SYSTEM";
    RENDERABLE_COMP_SYSTEM_TYPE[RENDERABLE_COMP_SYSTEM_TYPE["FRAME_BUFFER_SYSTEM"] = 4] = "FRAME_BUFFER_SYSTEM";
})(RENDERABLE_COMP_SYSTEM_TYPE || (RENDERABLE_COMP_SYSTEM_TYPE = {}));
export let RENDERABLE_COMP_TYPES_ALL = [RENDERABLE_COMP_TYPE.NORMAL, RENDERABLE_COMP_TYPE.NO_RENDER];
/**除去NO_RENDER的所有剩余类型 */
export let RENDERABLE_COMP_TYPES_NORMAL_RENDER = [RENDERABLE_COMP_TYPE.NORMAL];
//# sourceMappingURL=baseRenderableComp.js.map