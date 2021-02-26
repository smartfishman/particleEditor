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