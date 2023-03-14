import { data as shaderAssetData } from "../../../../../lib/shaderAssets/shaderAsset.js";
import webGLManager from "../../webGLManager.js";
import * as webglUtils from "../../webglUtils.js";
export default class Webgl2Particle {
    constructor(gl) {
        this._imageLoadIndex = 2;
        this.gl = gl;
        this.vertexShaderSource = shaderAssetData["particle/particle_vert"];
        this.fragShaderSource = shaderAssetData["particle/particle_frag"];
        this.vertexAttributeName1 = "a_position";
        this.vertexAttributeName2 = "a_texcoord";
        this.vertexAttributeName3 = "a_initialVelocity";
        this.vertexAttributeName4 = "a_acceleratedVelocity";
        this.vertexAttributeName5 = "a_lifeTime";
        this.vertexAttributeName6 = "a_createTime";
        this.vertexAttributeName7 = "a_initialRotationRate";
        this.vertexAttributeName8 = "a_rotationRateRange";
        this.vertexAttributeName9 = "randSeed";
        this.vertexAttributeName10 = "a_worldPos";
        this.matViewProjUniformName = "matViewProj";
        this.matWorldUniformName = "matWorld";
        this.curTimeUniformName = "u_curTime";
        this.imageUniformName = "u_image";
        this.fontImageUniformName = "u_font";
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
        this.glFontTexture = this.gl.createTexture();
    }
    bindBuffer() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glArrayBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.glElementBuffer);
        if (!this.image) {
            this.image = new Image();
            this.image.src = "http://localhost:3000/images/peach.png";
            this.image.onload = () => {
                this._imageLoadIndex--;
            };
            this.fontImage = new Image();
            this.fontImage.src = "http://localhost:3000/images/font.png";
            this.fontImage.onload = () => {
                this._imageLoadIndex--;
            };
        }
        if (this._imageLoadIndex <= 0) {
            let loc = this.gl.getUniformLocation(this.glProgram, this.imageUniformName);
            this.bindTexture(this.image, 0, this.gl.TEXTURE_2D, loc, this.glTexture);
            loc = this.gl.getUniformLocation(this.glProgram, this.fontImageUniformName);
            this.bindTexture(this.fontImage, 1, this.gl.TEXTURE_2D, loc, this.glFontTexture);
        }
    }
    /**初始化顶点属性 */
    initVertexAttribute() {
        let stride = 76;
        this.gl.bindAttribLocation(this.glProgram, 0, this.vertexAttributeName1);
        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, stride, 0);
        this.gl.bindAttribLocation(this.glProgram, 1, this.vertexAttributeName2);
        this.gl.enableVertexAttribArray(1);
        this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, stride, 12);
        this.gl.bindAttribLocation(this.glProgram, 2, this.vertexAttributeName3);
        this.gl.enableVertexAttribArray(2);
        this.gl.vertexAttribPointer(2, 3, this.gl.FLOAT, false, stride, 20);
        this.gl.bindAttribLocation(this.glProgram, 3, this.vertexAttributeName4);
        this.gl.enableVertexAttribArray(3);
        this.gl.vertexAttribPointer(3, 3, this.gl.FLOAT, false, stride, 32);
        this.gl.bindAttribLocation(this.glProgram, 4, this.vertexAttributeName5);
        this.gl.enableVertexAttribArray(4);
        this.gl.vertexAttribPointer(4, 1, this.gl.FLOAT, false, stride, 44);
        this.gl.bindAttribLocation(this.glProgram, 5, this.vertexAttributeName6);
        this.gl.enableVertexAttribArray(5);
        this.gl.vertexAttribPointer(5, 1, this.gl.FLOAT, false, stride, 48);
        this.gl.bindAttribLocation(this.glProgram, 6, this.vertexAttributeName7);
        this.gl.enableVertexAttribArray(6);
        this.gl.vertexAttribPointer(6, 1, this.gl.FLOAT, false, stride, 52);
        this.gl.bindAttribLocation(this.glProgram, 7, this.vertexAttributeName8);
        this.gl.enableVertexAttribArray(7);
        this.gl.vertexAttribPointer(7, 1, this.gl.FLOAT, false, stride, 56);
        this.gl.bindAttribLocation(this.glProgram, 8, this.vertexAttributeName9);
        this.gl.enableVertexAttribArray(8);
        this.gl.vertexAttribPointer(8, 1, this.gl.FLOAT, false, stride, 60);
        this.gl.bindAttribLocation(this.glProgram, 9, this.vertexAttributeName10);
        this.gl.enableVertexAttribArray(9);
        this.gl.vertexAttribPointer(9, 3, this.gl.FLOAT, false, stride, 64);
    }
    initUniformAttribute() {
        this.matViewProjUniformIndex = this.gl.getUniformLocation(this.glProgram, this.matViewProjUniformName);
        this.matWorldUniformIndex = this.gl.getUniformLocation(this.glProgram, this.matWorldUniformName);
        this.curTimeUniformIndex = this.gl.getUniformLocation(this.glProgram, this.curTimeUniformName);
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
    setUniformAttribute(matViewProj, matWorld, curTime) {
        this.gl.uniformMatrix4fv(this.matViewProjUniformIndex, false, matViewProj);
        this.gl.uniformMatrix4fv(this.matWorldUniformIndex, false, matWorld);
        this.gl.uniform1f(this.curTimeUniformIndex, curTime);
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
//# sourceMappingURL=webgl2_particle.js.map