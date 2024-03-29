import { renderableCompMgr } from "./pool/renderableCompMgr.js";
import { RENDERABLE_COMP_TYPES_NORMAL_RENDER } from "./render/baseRenderableComp.js";
import { WebGL2TestFrameBufferSystem } from "./render/webgl2/instance/frameBuffer/webGL2TestFrameBufferSystem.js";
import webGLManager from "./render/webGLManager.js";
import * as webglUtils from "./render/webglUtils.js";
/**
 * 管理渲染场景
 */
export class Root {
    constructor() {
    }
    init() {
        this._testFrameBufferSystem = new WebGL2TestFrameBufferSystem();
    }
    frameMove(dt) {
        let systems = renderableCompMgr.getAllRenderableCompByType(RENDERABLE_COMP_TYPES_NORMAL_RENDER);
        webGLManager.beginRenderPass();
        //第一次渲染
        webGLManager.getCamera().bindFrameBuffer(webglUtils.FRAME_BUFFER_RENDER_PHASE.THE_FRIST_RENDER);
        webGLManager.setUniformAttribute();
        systems.forEach(systemComp => {
            systemComp.draw();
        });
        if (webGLManager.getCamera().enableFrameBufferFeature) {
            let testFrameBufferSystem = this.getFrameBufferSystem();
            //第二次渲染
            webGLManager.getCamera().bindFrameBuffer(1);
            testFrameBufferSystem.update(dt);
            testFrameBufferSystem.draw();
            //第二次渲染时，深度信息被渲染到了颜色缓冲，此时可从颜色缓冲中读取场景中的深度信息
            webGLManager.checkDepthInfo();
            //第三次渲染
            webGLManager.getCamera().bindFrameBuffer(2);
            testFrameBufferSystem.update(dt);
            testFrameBufferSystem.draw();
        }
    }
    getFrameBufferSystem() {
        return this._testFrameBufferSystem;
    }
}
//# sourceMappingURL=root.js.map