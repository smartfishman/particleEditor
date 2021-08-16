import webGLManager from "./webGLManager.js";
export class GlobalValue {
}
GlobalValue.enableLog = false;
GlobalValue.testX = 0;
GlobalValue.testY = 0;
/**帧缓存渲染的渲染阶段 */
export var FRAME_BUFFER_RENDER_PHASE;
(function (FRAME_BUFFER_RENDER_PHASE) {
    FRAME_BUFFER_RENDER_PHASE[FRAME_BUFFER_RENDER_PHASE["THE_FRIST_RENDER"] = 0] = "THE_FRIST_RENDER";
    FRAME_BUFFER_RENDER_PHASE[FRAME_BUFFER_RENDER_PHASE["THE_SECOND_RENDER"] = 1] = "THE_SECOND_RENDER";
    FRAME_BUFFER_RENDER_PHASE[FRAME_BUFFER_RENDER_PHASE["THE_LAST_RENDER"] = 2] = "THE_LAST_RENDER";
})(FRAME_BUFFER_RENDER_PHASE || (FRAME_BUFFER_RENDER_PHASE = {}));
export function createShader(gl, type, source) {
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
    }
    else {
        console.error('compile shader error', shader);
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
}
export function createProgram(gl, vertexShader, fragmentShader) {
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
    }
    else {
        console.error('link program error', success);
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}
/**将帧缓冲中的深度信息转换为摄像机可视空间体里的线性深度值 */
export function LinearizeDepth(depth, near, far) {
    let z = depth * 2.0 - 1.0; // back to NDC 
    return -(2.0 * near * far) / (far + near - z * (far - near));
}
export function screenPointToCVV(out, screenX, screenY) {
    let screenWidth = webGLManager.getCamera().screenWidth;
    let screenHeight = webGLManager.getCamera().screenHeight;
    out.x = (screenX / screenWidth) * 2 - 1;
    out.y = (screenY / screenHeight) * 2 - 1;
    return out;
}
//# sourceMappingURL=webglUtils.js.map