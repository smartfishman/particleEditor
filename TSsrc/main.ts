import { eventManager } from "./core/event/eventManager.js";
import { WebGL2CoordinateSystem } from "./core/shader/webgl2/instance/webGL2CoordinateSystem.js";
import { WebGl2ParticleSystem } from "./core/shader/webgl2/instance/particle/webGL2ParticleSystem.js";
import webGLManager from "./core/shader/webGLManager.js"
import { timeManager } from "./core/utils/timeManager.js";

export function gameStart() {
    let canvas = document.getElementById("testCanvas") as HTMLCanvasElement;
    webGLManager.initWebGL(canvas);
    webGLManager.getCamera().update();
    eventManager.init();
    console.log("gameStart ");

    let coordi = new WebGL2CoordinateSystem();
    let particleSystem = new WebGl2ParticleSystem();
    let lastTime = timeManager.getTime();
    setInterval(() => {
        let dt = timeManager.getTime() - lastTime;
        lastTime = timeManager.getTime();
        webGLManager.getCamera().update();
        particleSystem.update(dt);
        coordi.draw();
        particleSystem.draw();
    }, 1000 / 60);

    let btn = document.getElementById("doBtn");
    btn.onclick = ()=>{
        particleSystem.updateConfig();
    };
}

setTimeout(() => {
    gameStart();
}, 2000);