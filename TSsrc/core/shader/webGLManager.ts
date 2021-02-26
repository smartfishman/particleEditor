import { Camera } from "../scene/camera.js";

class WebGLManager {
    private static _instance: WebGLManager;
    public static getInstance(): WebGLManager {
        if (!WebGLManager._instance) {
            WebGLManager._instance = new WebGLManager();
        }
        return WebGLManager._instance;
    }

    private _canvas: HTMLCanvasElement;
    private _gl: WebGLRenderingContext;
    private _camera: Camera;

    public initWebGL(canvas: HTMLCanvasElement): void {
        this._canvas = canvas;
        this._gl = canvas.getContext("webgl2");
    }

    public getWebGLRenderingContext(): WebGLRenderingContext {
        return this._gl;
    }

    public getCanvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public getCamera(): Camera {
        if (!this._camera) {
            this._camera = new Camera();
        }
        return this._camera;
    }

    public setCamera(camera: Camera): void {
        this._camera = camera;
    }
}

let webGLManager = WebGLManager.getInstance();
export default webGLManager;