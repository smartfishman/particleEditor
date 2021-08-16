import { eventManager } from "./core/event/eventManager.js";
import webGLManager from "./core/render/webGLManager.js";
import { timeManager } from "./core/utils/timeManager.js";
import { RENDERABLE_COMP_SYSTEM_TYPE } from "./core/render/baseRenderableComp.js";
import * as webglUtils from "./core/render/webglUtils.js";
import { renderableCompMgr } from "./core/pool/renderableCompMgr.js";
import { director } from "./core/director.js";
export function gameStart() {
    let canvas = document.getElementById("testCanvas");
    webGLManager.initWebGL(canvas);
    webGLManager.getCamera().update();
    eventManager.init();
    director.init();
    console.log("gameStart ");
    renderableCompMgr.createCompBySystemType(RENDERABLE_COMP_SYSTEM_TYPE.COORDINATE_SYSTEM);
    renderableCompMgr.createCompBySystemType(RENDERABLE_COMP_SYSTEM_TYPE.CUBE_SYSTEM);
    let comp = renderableCompMgr.createCompBySystemType(RENDERABLE_COMP_SYSTEM_TYPE.CUBE_SYSTEM);
    comp.node.position.x = 200;
    let particleSystem = renderableCompMgr.createCompBySystemType(RENDERABLE_COMP_SYSTEM_TYPE.PARTICLE_SYSTEM);
    let lastTime = timeManager.getTime();
    setInterval(() => {
        let dt = timeManager.getTime() - lastTime;
        lastTime = timeManager.getTime();
        director.mainLoop(dt);
    }, 1000 / 60);
    let btn = document.getElementById("doBtn");
    btn.onclick = () => {
        particleSystem.updateConfig();
    };
    canvas.onclick = (event) => {
        webglUtils.GlobalValue.enableLog = true;
        webglUtils.GlobalValue.testX = event.offsetX;
        webglUtils.GlobalValue.testY = 450 - event.offsetY;
    };
}
setTimeout(() => {
    gameStart();
}, 2000);
//# sourceMappingURL=main.js.map