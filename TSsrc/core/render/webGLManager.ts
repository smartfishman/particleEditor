import { Ray } from "../geometry/ray.js";
import { renderableCompMgr } from "../pool/renderableCompMgr.js";
import { Camera } from "../scene/camera.js";
import { Mat4 } from "../utils/mat4.js";
import Utils from "../utils/utils.js";
import { Vec2 } from "../utils/vec2.js";
import { Vec3 } from "../utils/vec3.js";
import { Vec4 } from "../utils/vec4.js";
import * as webglUtils from "./webglUtils.js";

class WebGLManager {
    private static _instance: WebGLManager;
    public static getInstance(): WebGLManager {
        if (!WebGLManager._instance) {
            WebGLManager._instance = new WebGLManager();
        }
        return WebGLManager._instance;
    }

    private _canvas: HTMLCanvasElement;
    private _gl: WebGL2RenderingContext;
    private _camera: Camera;

    public currentGlProgram: WebGLProgram;

    public initWebGL(canvas: HTMLCanvasElement): void {
        this._canvas = canvas;
        this._gl = canvas.getContext("webgl2");
        this._gl.getExtension('EXT_color_buffer_float');
        this._gl.getExtension('EXT_float_blend');
    }

    public getWebGLRenderingContext(): WebGL2RenderingContext {
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

    public useProgram(glProgram: WebGLProgram): void {
        this._gl.useProgram(glProgram);
        this.currentGlProgram = glProgram;
    }

    public beginRenderPass(): void {
        this._gl.clear(this._gl.DEPTH_BUFFER_BIT | this._gl.COLOR_BUFFER_BIT);
    }

    public checkFrameBuffStatus(): void {
        switch (this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER)) {
            case this._gl.FRAMEBUFFER_COMPLETE:
                break;
            case this._gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                console.log("GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT：帧缓冲区的所有挂载点都没有准备好");
                break;
            case this._gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                console.log("GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT：帧缓冲区一张图像也没有挂载");
                break;
            case this._gl.FRAMEBUFFER_DEFAULT:
                console.log("FRAMEBUFFER_DEFAULT");
                break;
            case this._gl.FRAMEBUFFER_BINDING:
                console.log("FRAMEBUFFER_BINDING");
                break;
            case this._gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                console.log("FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                break;
            case this._gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
                console.log("FRAMEBUFFER_INCOMPLETE_MULTISAMPLE");
                break;
            case this._gl.FRAMEBUFFER_UNSUPPORTED:
                console.log("FRAMEBUFFER_UNSUPPORTED");
                break;
            default:
                console.log("error default");
                break;
        }
    }

    public checkDepthInfo(): void {
        if (webglUtils.GlobalValue.enableLog) {
            let gl = webGLManager.getWebGLRenderingContext();
            let depthData = new Float32Array(4);
            gl.readPixels(webglUtils.GlobalValue.testX, webglUtils.GlobalValue.testY, 1, 1, gl.RGBA, gl.FLOAT, depthData);
            let depth = webglUtils.LinearizeDepth(depthData[0], this.getCamera().near, this.getCamera().far);
            console.log(depthData[0], depth);
            webglUtils.GlobalValue.enableLog = false;
            
            let pos = new Vec4();
            let cvvXY = new Vec2();
            webglUtils.screenPointToCVV(cvvXY, webglUtils.GlobalValue.testX, webglUtils.GlobalValue.testY);
            pos.x = cvvXY.x * (-depth);
            pos.y = cvvXY.y * (-depth);
            pos.z = (depthData[0] * 2 - 1) * (-depth);
            pos.w = -depth;

            let invertMatViewProj = new Mat4();
            Mat4.invert(invertMatViewProj, this.getCamera().matViewProj);
            Vec4.transformMat4(pos, pos, invertMatViewProj);
            console.log(pos);

            let ray = new Ray();
            Ray.fromPoints(ray, this._camera.getPos(), new Vec3(pos.x, pos.y, pos.z));
            let nearestComp = renderableCompMgr.checkNearestIntersectByRay(ray);
            if (nearestComp) {
                let comps = renderableCompMgr.getAllRenderableCompByType();
                comps.forEach(comp => {
                    comp.showAABB = false;
                });
                nearestComp.showAABB = true;
            }
        }
    }
}

let webGLManager = WebGLManager.getInstance();
export default webGLManager;