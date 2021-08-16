import { Vec2 } from "../utils/vec2.js";
import webGLManager from "./webGLManager.js";

export class GlobalValue {
    public static enableLog = false;
    public static testX = 0;
    public static testY = 0;
}

/**帧缓存渲染的渲染阶段 */
export enum FRAME_BUFFER_RENDER_PHASE {
    THE_FRIST_RENDER = 0,
    THE_SECOND_RENDER = 1,
    THE_LAST_RENDER = 2,
}

export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    let shader = gl.createShader(type);
    if (!shader) {
        console.error('create shader error', source);
        return;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    } else {
        console.error('compile shader error', shader);
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
}

export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    let program = gl.createProgram();
    if (!program) {
        console.error('create program error');
        return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    } else {
        console.error('link program error', success);
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}

/**将帧缓冲中的深度信息转换为摄像机可视空间体里的线性深度值 */
export function LinearizeDepth(depth: number, near: number, far: number): number {
    let z = depth * 2.0 - 1.0; // back to NDC 
    return -(2.0 * near * far) / (far + near - z * (far - near));
}

export function screenPointToCVV(out: Vec2, screenX: number, screenY: number): Vec2 {
    let screenWidth = webGLManager.getCamera().screenWidth;
    let screenHeight = webGLManager.getCamera().screenHeight;
    out.x = (screenX / screenWidth) * 2 - 1;
    out.y = (screenY / screenHeight) * 2 - 1;
    return out;
}

export function makeTranslation(tx, ty, tz): number[] {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1
    ];
}


