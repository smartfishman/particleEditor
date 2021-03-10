import { Camera } from "../scene/camera.js";
class WebGLManager {
    static getInstance() {
        if (!WebGLManager._instance) {
            WebGLManager._instance = new WebGLManager();
        }
        return WebGLManager._instance;
    }
    initWebGL(canvas) {
        this._canvas = canvas;
        this._gl = canvas.getContext("webgl2");
    }
    getWebGLRenderingContext() {
        return this._gl;
    }
    getCanvas() {
        return this._canvas;
    }
    getCamera() {
        if (!this._camera) {
            this._camera = new Camera();
        }
        return this._camera;
    }
    setCamera(camera) {
        this._camera = camera;
    }
    useProgram(glProgram) {
        this._gl.useProgram(glProgram);
        this.currentGlProgram = glProgram;
    }
}
let webGLManager = WebGLManager.getInstance();
export default webGLManager;
//# sourceMappingURL=webGLManager.js.map