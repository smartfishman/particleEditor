import { data as shaderAssetData } from "../../../../../lib/shaderAssets/shaderAsset.js";
import webGLManager from "../../webGLManager.js";
import * as webglUtils from "../../webglUtils.js";
import { UBOCamera, UBOGlobal, UBOLocal } from "./defines/constantsDefine.js";

export default class Webgl2Curve {
    private gl: WebGL2RenderingContext;
    private glProgram: WebGLProgram;

    private vertexShaderSource: string;
    private fragShaderSource: string;
    private vertexAttributeName1: string;
    private vertexAttributeName2: string;
    private imageUniformName: string;
    private createTimeUniformName: string;

    private createTimeUniformIndex: WebGLUniformLocation;

    private image: HTMLImageElement;
    private buffDataLen: number;

    private glArrayBuffer: WebGLBuffer;
    private glElementBuffer: WebGLBuffer;
    private glInstancedBuffer: WebGLBuffer;
    private glTexture: WebGLTexture;
    private glVAO: WebGLVertexArrayObject;
    private glUBOCameraBuffer: WebGLBuffer;
    private glUBOGlobalBuffer: WebGLBuffer;
    private glUBOLocalBuffer: WebGLBuffer;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl as WebGL2RenderingContext;
        this.vertexShaderSource = shaderAssetData["curve/curve_vert"]
        this.fragShaderSource = shaderAssetData["curve/curve_frag"];
        this.vertexAttributeName1 = "a_position";
        this.vertexAttributeName2 = "a_normalVector";
        this.imageUniformName = "u_image2";
        this.createTimeUniformName = "u_createTime";
        this.initShader();
    }

    /**初始化着色器 */
    private initShader(): void {
        let vertexShader = webglUtils.createShader(this.gl, this.gl.VERTEX_SHADER, this.vertexShaderSource);
        let fragShader = webglUtils.createShader(this.gl, this.gl.FRAGMENT_SHADER, this.fragShaderSource);
        this.glProgram = webglUtils.createProgram(this.gl, vertexShader, fragShader);
        this.glArrayBuffer = this.gl.createBuffer();
        this.glElementBuffer = this.gl.createBuffer();
        this.glInstancedBuffer = this.gl.createBuffer();
        this.glTexture = this.gl.createTexture();
        this.initVAO();
        this.initUBO();
    }

    private _imageLoadIndex = 1;
    private bindTexture(): void {
        if (!this.image) {
            this.image = new Image();
            this.image.src = "http://localhost:3000/images/timg.jpg";
            this.image.onload = () => {
                this._imageLoadIndex--;
            };
        }
        if (this._imageLoadIndex <= 0) {
            let loc = this.gl.getUniformLocation(this.glProgram, this.imageUniformName);
            this._bindTexture(this.image, 1, this.gl.TEXTURE_2D, loc, this.glTexture);
        }
    }

    private initVAO(): void {
        this.glVAO = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.glVAO);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.glElementBuffer);
        this.initVertexAttribute();
        this.initInstancedVertexAttr();
        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    private initUBO(): void {
        this.glUBOCameraBuffer = webGLManager.getUniformBufferByBindings(UBOCamera.BINDING);
        let uboLocation = this.gl.getUniformBlockIndex(this.glProgram, UBOCamera.NAME);
        this.gl.uniformBlockBinding(this.glProgram, uboLocation, UBOCamera.BINDING);

        this.glUBOGlobalBuffer = webGLManager.getUniformBufferByBindings(UBOGlobal.BINDING);
        uboLocation = this.gl.getUniformBlockIndex(this.glProgram, UBOGlobal.NAME);
        this.gl.uniformBlockBinding(this.glProgram, uboLocation, UBOGlobal.BINDING);

        this.glUBOLocalBuffer = webGLManager.getUniformBufferByBindings(UBOLocal.BINDING);
        uboLocation = this.gl.getUniformBlockIndex(this.glProgram, UBOLocal.NAME);
        this.gl.uniformBlockBinding(this.glProgram, uboLocation, UBOLocal.BINDING);
    }

    /**初始化顶点属性 */
    private initVertexAttribute(): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glArrayBuffer);
        let stride = 24;
        this.gl.bindAttribLocation(this.glProgram, 0, this.vertexAttributeName1);
        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, stride, 0);

        this.gl.bindAttribLocation(this.glProgram, 1, this.vertexAttributeName2);
        this.gl.enableVertexAttribArray(1);
        this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, stride, 12);
    }

    private initInstancedVertexAttr(): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glInstancedBuffer);
        let stride = 80;
        this.gl.enableVertexAttribArray(3);
        this.gl.enableVertexAttribArray(4);
        this.gl.enableVertexAttribArray(5);
        this.gl.enableVertexAttribArray(6);
        this.gl.enableVertexAttribArray(7);
        this.gl.enableVertexAttribArray(8);
        this.gl.vertexAttribPointer(3, 4, this.gl.FLOAT, false, stride, 0);
        this.gl.vertexAttribPointer(4, 4, this.gl.FLOAT, false, stride, 16);
        this.gl.vertexAttribPointer(5, 4, this.gl.FLOAT, false, stride, 32);
        this.gl.vertexAttribPointer(6, 4, this.gl.FLOAT, false, stride, 48);
        this.gl.vertexAttribPointer(7, 3, this.gl.FLOAT, false, stride, 64);
        this.gl.vertexAttribPointer(8, 1, this.gl.FLOAT, false, stride, 76);
        this.gl.vertexAttribDivisor(3, 1);
        this.gl.vertexAttribDivisor(4, 1);
        this.gl.vertexAttribDivisor(5, 1);
        this.gl.vertexAttribDivisor(6, 1);
        this.gl.vertexAttribDivisor(7, 1);
        this.gl.vertexAttribDivisor(8, 1);
    }

    private initUniformAttribute(): void {
        this.createTimeUniformIndex = this.gl.getUniformLocation(this.glProgram, this.createTimeUniformName);
    }

    public setUniformAttribute(createTime: number): void {
        this.gl.uniform1f(this.createTimeUniformIndex, createTime);
    }

    /**
     * 
     * @param buffData 
     * @param type 1=ARRAY_BUFFER 2=ELEMENT_ARRAY_BUFFER 3=instancedBuffer
     */
    public setBufferData(buffData: Float32Array | Int16Array, type: number = 1): void {
        switch (type) {
            case 1:
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glArrayBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, buffData, this.gl.STATIC_DRAW);
                // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
                break;
            case 2:
                this.buffDataLen = buffData.length;
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.glElementBuffer);
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, buffData, this.gl.STATIC_DRAW);
                // this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
                break;
            case 3:
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glInstancedBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, buffData, this.gl.STATIC_DRAW);
                break;
            default:
                console.error("unknown type");
                break;
        }

    }

    private _bindTexture(image: TexImageSource, textureUnitsOffset: number, textureObjects: number, uniformLoc: WebGLUniformLocation, glTexture: WebGLTexture): void {
        this.gl.activeTexture(this.gl.TEXTURE0 + textureUnitsOffset);
        this.gl.bindTexture(textureObjects, glTexture);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texImage2D(textureObjects, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.uniform1i(uniformLoc, textureUnitsOffset);
    }

    public bindState(): void {
        webGLManager.useProgram(this.glProgram);
        this.gl.bindVertexArray(this.glVAO);
        this.initUniformAttribute();
        this.bindTexture();
    }

    public draw(): void {
        this.gl.drawElements(this.gl.TRIANGLES, this.buffDataLen, this.gl.UNSIGNED_SHORT, 0);
        this.gl.bindVertexArray(null);
    }

    public drawElementInstance(instanceCount: number): void {
        this.gl.drawElementsInstanced(this.gl.TRIANGLES, this.buffDataLen, this.gl.UNSIGNED_SHORT, 0, instanceCount);
        this.gl.bindVertexArray(null);
    }
}