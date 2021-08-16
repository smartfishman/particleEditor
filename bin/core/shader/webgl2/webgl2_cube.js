import { data as shaderAssetData } from "../../../../lib/shaderAssets/shaderAsset.js";
import webGLManager from "../webGLManager.js";
import * as webglUtils from "../webglUtils.js";
export default class Webgl2Cube {
    constructor(gl) {
        this._imageLoadIndex = 1;
        this.gl = gl;
        this.vertexShaderSource = shaderAssetData["standard/standard_vert"];
        this.fragShaderSource = shaderAssetData["standard/standard_frag"];
        this.vertexAttributeName1 = "a_position";
        this.vertexAttributeName2 = "a_texcoord";
        this.vertexAttributeName3 = "a_normalVector";
        this.matViewProjUniformName = "matViewProj";
        this.matWorldUniformName = "matWorld";
        this.lightColorUniformName = "lightColor";
        this.lightPosUniformName = "lightPos";
        this.viewPosUniformName = "viewPos";
        this.imageUniformName = "u_image2";
        this.initShader();
    }
    /**初始化着色器 */
    initShader() {
        let vertexShader = webglUtils.createShader(this.gl, this.gl.VERTEX_SHADER, this.vertexShaderSource);
        let fragShader = webglUtils.createShader(this.gl, this.gl.FRAGMENT_SHADER, this.fragShaderSource);
        this.glProgram = webglUtils.createProgram(this.gl, vertexShader, fragShader);
        this.glArrayBuffer = this.gl.createBuffer();
        this.glElementBuffer = this.gl.createBuffer();
        this.glTexture = this.gl.createTexture();
    }
    bindBuffer() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glArrayBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.glElementBuffer);
        if (!this.image) {
            this.image = new Image();
            this.image.src = "http://localhost:3000/images/timg.jpg";
            this.image.onload = () => {
                this._imageLoadIndex--;
            };
        }
        if (this._imageLoadIndex <= 0) {
            let loc = this.gl.getUniformLocation(this.glProgram, this.imageUniformName);
            this.bindTexture(this.image, 1, this.gl.TEXTURE_2D, loc, this.glTexture);
        }
    }
    /**初始化顶点属性 */
    initVertexAttribute() {
        let stride = 32;
        this.gl.bindAttribLocation(this.glProgram, 0, this.vertexAttributeName1);
        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, stride, 0);
        this.gl.bindAttribLocation(this.glProgram, 1, this.vertexAttributeName2);
        this.gl.enableVertexAttribArray(1);
        this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, stride, 12);
        this.gl.bindAttribLocation(this.glProgram, 2, this.vertexAttributeName3);
        this.gl.enableVertexAttribArray(2);
        this.gl.vertexAttribPointer(2, 3, this.gl.FLOAT, false, stride, 20);
    }
    initUniformAttribute() {
        this.matViewProjUniformIndex = this.gl.getUniformLocation(this.glProgram, this.matViewProjUniformName);
        this.matWorldUniformIndex = this.gl.getUniformLocation(this.glProgram, this.matWorldUniformName);
        this.lightColorUniformIndex = this.gl.getUniformLocation(this.glProgram, this.lightColorUniformName);
        this.lightPosUniformIndex = this.gl.getUniformLocation(this.glProgram, this.lightPosUniformName);
        this.viewPosUniformIndex = this.gl.getUniformLocation(this.glProgram, this.viewPosUniformName);
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
    setUniformAttribute(matViewProj, matWorld) {
        this.gl.uniformMatrix4fv(this.matViewProjUniformIndex, false, matViewProj);
        this.gl.uniformMatrix4fv(this.matWorldUniformIndex, false, matWorld);
        this.gl.uniform3fv(this.lightColorUniformIndex, [1, 1, 1]);
        this.gl.uniform3fv(this.lightPosUniformIndex, [100, 200, 100]);
        let viewPos = webGLManager.getCamera().getPos();
        this.gl.uniform3f(this.viewPosUniformIndex, viewPos.x, viewPos.y, viewPos.z);
    }
    bindTexture(image, textureUnitsOffset, textureObjects, uniformLoc, glTexture) {
        this.gl.activeTexture(this.gl.TEXTURE0 + textureUnitsOffset);
        this.gl.bindTexture(textureObjects, glTexture);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texImage2D(textureObjects, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.uniform1i(uniformLoc, textureUnitsOffset);
    }
    bindState() {
        webGLManager.useProgram(this.glProgram);
        this.bindBuffer();
        this.initVertexAttribute();
        this.initUniformAttribute();
    }
    draw() {
        this.gl.drawElements(this.gl.TRIANGLES, this.buffDataLen, this.gl.UNSIGNED_SHORT, 0);
    }
}
//# sourceMappingURL=webgl2_cube.js.map