import { renderableCompMgr } from "./pool/renderableCompMgr.js";
import { BaseRenderableComp, RENDERABLE_COMP_TYPES_NORMAL_RENDER } from "./render/baseRenderableComp.js";
import webGLManager from "./render/webGLManager.js";
import * as webglUtils from "./render/webglUtils.js";
import { Root } from "./root.js";

/**
 * 控制游戏逻辑主循环
 */
class Director {
    private static _instance: Director;
    public static getInstance(): Director {
        if (!Director._instance) {
            Director._instance = new Director();
        }
        return Director._instance;
    }

    private _root: Root;

    constructor() {
    }

    public init(): void {
        this._root = new Root();
        this._root.init();
    }

    public mainLoop(dt: number) {
        let systems: BaseRenderableComp[] = renderableCompMgr.getAllRenderableCompByType(RENDERABLE_COMP_TYPES_NORMAL_RENDER);
        webGLManager.getCamera().update();
        systems.forEach(systemComp => {
            systemComp.update(dt);
        })
        this._root.frameMove(dt);
    }
}

export let director = Director.getInstance();