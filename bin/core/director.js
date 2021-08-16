import { renderableCompMgr } from "./pool/renderableCompMgr.js";
import { RENDERABLE_COMP_TYPES_NORMAL_RENDER } from "./render/baseRenderableComp.js";
import webGLManager from "./render/webGLManager.js";
import { Root } from "./root.js";
/**
 * 控制游戏逻辑主循环
 */
class Director {
    constructor() {
    }
    static getInstance() {
        if (!Director._instance) {
            Director._instance = new Director();
        }
        return Director._instance;
    }
    init() {
        this._root = new Root();
        this._root.init();
    }
    mainLoop(dt) {
        let systems = renderableCompMgr.getAllRenderableCompByType(RENDERABLE_COMP_TYPES_NORMAL_RENDER);
        webGLManager.getCamera().update();
        systems.forEach(systemComp => {
            systemComp.update(dt);
        });
        this._root.frameMove(dt);
    }
}
export let director = Director.getInstance();
//# sourceMappingURL=director.js.map