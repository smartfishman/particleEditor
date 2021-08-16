import { data as shaderAssetData } from "../../../../lib/shaderAssets/shaderAsset.js";
import webGLManager from "../webGLManager.js";
import * as webglUtils from "../webglUtils.js";
export default class Webgl2Base {
    constructor(gl, USE_TEXTURE = 0) {
        /**是否使用帧缓存纹理渲染图像 */
        this.USE_TEXTURE = 0;
        this.gl = gl;
        this.vertexShaderSource = shaderAssetData.base_vert;
        this.fragShaderSource = shaderAssetData.base_frag;
        this.vertexAttributeName = "position";
        this.vertexAttributeName2 = "a_texcoord";
        this.matViewProjUniformName = "matViewProj";
        this.matWorldUniformName = "matWorld";
        this.matWorld2UniformName = "matWorld2";
        this.colorUniformName = "color";
        this.useTextureUniformName = "USE_TEXTURE";
        this.imageUniformName = "u_image";
        this.USE_TEXTURE = USE_TEXTURE;
        this.initShader();
    }
    /**初始化着色器 */
    initShader() {
        let vertexShader = webglUtils.createShader(this.gl, this.gl.VERTEX_SHADER, this.vertexShaderSource);
        let fragShader = webglUtils.createShader(this.gl, this.gl.FRAGMENT_SHADER, this.fragShaderSource);
        this.glProgram = webglUtils.createProgram(this.gl, vertexShader, fragShader);
    }
    bindBuffer() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.gl.createBuffer());
        if (this.USE_TEXTURE) {
            let loc = this.gl.getUniformLocation(this.glProgram, this.imageUniformName);
            this.bindTexture(0, this.gl.TEXTURE_2D, loc, webGLManager.getCamera().getCurRenderTarget());
        }
    }
    /**初始化顶点属性 */
    initVertexAttribute() {
        let stride = 12;
        if (this.USE_TEXTURE) {
            stride = 20;
            this.gl.bindAttribLocation(this.glProgram, 0, this.vertexAttributeName);
            this.gl.enableVertexAttribArray(0);
            this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, stride, 0);
            this.gl.bindAttribLocation(this.glProgram, 1, this.vertexAttributeName2);
            this.gl.enableVertexAttribArray(1);
            this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, stride, 12);
        }
        else {
            this.gl.bindAttribLocation(this.glProgram, 0, this.vertexAttributeName);
            this.gl.enableVertexAttribArray(0);
            this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, stride, 0);
        }
    }
    initUniformAttribute() {
        this.matViewProjUniformIndex = this.gl.getUniformLocation(this.glProgram, this.matViewProjUniformName);
        this.matWorldUniformIndex = this.gl.getUniformLocation(this.glProgram, this.matWorldUniformName);
        this.matWorld2UniformIndex = this.gl.getUniformLocation(this.glProgram, this.matWorld2UniformName);
        this.colorUniformIndex = this.gl.getUniformLocation(this.glProgram, this.colorUniformName);
        this.useTextureUniformIndex = this.gl.getUniformLocation(this.glProgram, this.useTextureUniformName);
    }
    /**
     *
     * @param buffData
     * @param type 1=ARRAY_BUFFER 2=ELEMENT_ARRAY_BUFFER
     */
    setBufferData(buffData, type = 1) {
        this.buffDataLen = buffData.length;
        switch (type) {
            case 1:
                this.gl.bufferData(this.gl.ARRAY_BUFFER, buffData, this.gl.STATIC_DRAW);
                break;
            case 2:
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, buffData, this.gl.STATIC_DRAW);
                break;
            default:
                console.error("unknown type");
                break;
        }
    }
    setUniformAttribute(matViewProj, matWorld, color, matWorld2 = []) {
        this.gl.uniformMatrix4fv(this.matViewProjUniformIndex, false, matViewProj);
        this.gl.uniformMatrix4fv(this.matWorldUniformIndex, false, matWorld);
        this.gl.uniformMatrix4fv(this.matWorld2UniformIndex, false, matWorld2);
        this.gl.uniform4fv(this.colorUniformIndex, color);
        this.gl.uniform1f(this.useTextureUniformIndex, this.USE_TEXTURE);
    }
    bindState() {
        webGLManager.useProgram(this.glProgram);
        this.bindBuffer();
        this.initVertexAttribute();
        this.initUniformAttribute();
    }
    bindTexture(textureUnitsOffset, textureObjects, uniformLoc, glTexture) {
        this.gl.activeTexture(this.gl.TEXTURE0 + textureUnitsOffset);
        this.gl.bindTexture(textureObjects, glTexture);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.uniform1i(uniformLoc, textureUnitsOffset);
    }
    draw() {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, Math.floor(this.buffDataLen / 3));
    }
    drawArrayLines() {
        this.gl.drawArrays(this.gl.LINES, 0, Math.floor(this.buffDataLen / 3));
    }
    drawElementTriangles() {
        this.gl.drawElements(this.gl.TRIANGLES, this.buffDataLen, this.gl.UNSIGNED_SHORT, 0);
    }
    drawElements() {
        this.gl.drawElements(this.gl.LINES, this.buffDataLen, this.gl.UNSIGNED_SHORT, 0);
    }
}
//# sourceMappingURL=webgl2_base.js.map