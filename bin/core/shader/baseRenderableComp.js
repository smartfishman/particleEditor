import renderableCompMgr from "../pool/renderableCompMgr.js";
import webGLManager from "./webGLManager.js";
export class BaseRenderableComp {
    constructor(type = RENDERABLE_COMP_TYPE.NORMAL) {
        this.compType = RENDERABLE_COMP_TYPE.NORMAL;
        this.compType = type;
        renderableCompMgr.registerRenderableComp(this);
    }
    getGL() {
        return webGLManager.getWebGLRenderingContext();
    }
    update(dt) {
    }
    draw() {
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
export let RENDERABLE_COMP_TYPES_ALL = [RENDERABLE_COMP_TYPE.NORMAL, RENDERABLE_COMP_TYPE.NO_RENDER];
/**除去NO_RENDER的所有剩余类型 */
export let RENDERABLE_COMP_TYPES_NORMAL_RENDER = [RENDERABLE_COMP_TYPE.NORMAL];
//# sourceMappingURL=baseRenderableComp.js.map