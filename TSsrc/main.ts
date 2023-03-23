import { eventManager } from "./core/event/eventManager.js";
import { WebGl2ParticleSystem } from "./core/render/webgl2/instance/particle/webGL2ParticleSystem.js";
import webGLManager from "./core/render/webGLManager.js"
import { timeManager } from "./core/utils/timeManager.js";
import { BaseRenderableComp, RENDERABLE_COMP_SYSTEM_TYPE } from "./core/render/baseRenderableComp.js";
import * as webglUtils from "./core/render/webglUtils.js";

import { renderableCompMgr } from "./core/pool/renderableCompMgr.js";
import { director } from "./core/director.js";
import { Webgl2ClothSystem } from "./core/render/webgl2/instance/cloth/clothSystem.js";

export function gameStart() {
    let canvas = document.getElementById("testCanvas") as HTMLCanvasElement;
    webGLManager.initWebGL(canvas);
    webGLManager.getCamera().update();
    eventManager.init();
    director.init();
    console.log("gameStart ");

    renderableCompMgr.createCompBySystemType(RENDERABLE_COMP_SYSTEM_TYPE.COORDINATE_SYSTEM);
    let clothComp = renderableCompMgr.createCompBySystemType(RENDERABLE_COMP_SYSTEM_TYPE.CLOTH_SYSTEM);
    clothComp.node.position.y = 150;
    renderableCompMgr.createCompBySystemType(RENDERABLE_COMP_SYSTEM_TYPE.CUBE_SYSTEM);
    let comp = renderableCompMgr.createCompBySystemType(RENDERABLE_COMP_SYSTEM_TYPE.CUBE_SYSTEM);
    comp.node.position.x = 200;
    let particleSystem: WebGl2ParticleSystem = renderableCompMgr.createCompBySystemType(RENDERABLE_COMP_SYSTEM_TYPE.PARTICLE_SYSTEM) as WebGl2ParticleSystem;

    let heatDiffusionSystem = renderableCompMgr.createCompBySystemType(RENDERABLE_COMP_SYSTEM_TYPE.HEAT_DIFFUSION_SYSTEM);
    let curveSystem = renderableCompMgr.createCompBySystemType(RENDERABLE_COMP_SYSTEM_TYPE.CURVE_SYSTEM);
    
    let lastTime = timeManager.getTime();
    setInterval(() => {
        let dt = timeManager.getTime() - lastTime;
        lastTime = timeManager.getTime();
        director.mainLoop(dt);
    }, 1000 / 60);

    let btn = document.getElementById("doBtn");
    btn.onclick = () => {
        particleSystem.updateConfig();
        (<Webgl2ClothSystem>clothComp).enableForce();
    };
    canvas.onclick = (event: MouseEvent) => {
        webglUtils.GlobalValue.enableLog = true;
        webglUtils.GlobalValue.testX = event.offsetX;
        webglUtils.GlobalValue.testY = 450 - event.offsetY;
    };
}

setTimeout(() => {
    gameStart();
}, 2000);