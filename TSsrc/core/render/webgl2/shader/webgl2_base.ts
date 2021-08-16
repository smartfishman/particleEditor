import { data as shaderAssetData } from "../../../../../lib/shaderAssets/shaderAsset.js"
import webGLManager from "../../webGLManager.js";
import * as webglUtils from "../../webglUtils.js"

export default class Webgl2Base {
    private gl: WebGL2RenderingContext;
    private glProgram: WebGLProgram;

    private vertexShaderSource: string;
    private fragShaderSource: string;
    private vertexAttributeName: string;
    private vertexAttributeName2: string;
    private matViewProjUniformName: string;
    private matWorldUniformName: string;
    private matWorld2UniformName: string;
    private colorUniformName: string;
    private useTextureUniformName: string;
    private imageUniformName: string;

    private matViewProjUniformIndex: WebGLUniformLocation;
    private matWorldUniformIndex: WebGLUniformLocation;
    private matWorld2UniformIndex: WebGLUniformLocation;
    private colorUniformIndex: WebGLUniformLocation;
    private useTextureUniformIndex: WebGLUniformLocation;

    private buffDataLen: number;
    /**是否使用帧缓存纹理渲染图像 */
    private USE_TEXTURE: number = 0;


    constructor(gl: WebGLRenderingContext, USE_TEXTURE: number = 0) {
        this.gl = gl as WebGL2RenderingContext;
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
    private initShader(): void {
        let vertexShader = webglUtils.createShader(this.gl, this.gl.VERTEX_SHADER, this.vertexShaderSource);
        let fragShader = webglUtils.createShader(this.gl, this.gl.FRAGMENT_SHADER, this.fragShaderSource);
        this.glProgram = webglUtils.createProgram(this.gl, vertexShader, fragShader);
    }

    private bindBuffer(): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.gl.createBuffer());
        if (this.USE_TEXTURE) {
            let loc = this.gl.getUniformLocation(this.glProgram, this.imageUniformName);
            this.bindTexture(0, this.gl.TEXTURE_2D, loc, webGLManager.getCamera().getCurRenderTarget());
        }
    }

    /**初始化顶点属性 */
    private initVertexAttribute(): void {
        let stride = 12;
        if (this.USE_TEXTURE) {
            stride = 20;
            this.gl.bindAttribLocation(this.glProgram, 0, this.vertexAttributeName);
            this.gl.enableVertexAttribArray(0);
            this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, stride, 0);
            this.gl.bindAttribLocation(this.glProgram, 1, this.vertexAttributeName2);
            this.gl.enableVertexAttribArray(1);
            this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, stride, 12);
        } else {
            this.gl.bindAttribLocation(this.glProgram, 0, this.vertexAttributeName);
            this.gl.enableVertexAttribArray(0);
            this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, stride, 0);
        }
    }

    private initUniformAttribute(): void {
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
    public setBufferData(buffData: Float32Array | Int16Array, type: number = 1): void {
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

    public setUniformAttribute(matViewProj: Float32List, matWorld: Float32List, color: Float32List, matWorld2: Float32List = []): void {
        this.gl.uniformMatrix4fv(this.matViewProjUniformIndex, false, matViewProj);
        this.gl.uniformMatrix4fv(this.matWorldUniformIndex, false, matWorld);
        this.gl.uniformMatrix4fv(this.matWorld2UniformIndex, false, matWorld2);
        this.gl.uniform4fv(this.colorUniformIndex, color);
        this.gl.uniform1f(this.useTextureUniformIndex, this.USE_TEXTURE);
    }

    public bindState(): void {
        webGLManager.useProgram(this.glProgram);
        this.bindBuffer();
        this.initVertexAttribute();
        this.initUniformAttribute();
    }

    private bindTexture(textureUnitsOffset: number, textureObjects: number, uniformLoc: WebGLUniformLocation, glTexture: WebGLTexture): void {
        this.gl.activeTexture(this.gl.TEXTURE0 + textureUnitsOffset);
        this.gl.bindTexture(textureObjects, glTexture);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(textureObjects, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.uniform1i(uniformLoc, textureUnitsOffset);
    }

    public draw(): void {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, Math.floor(this.buffDataLen / 3));
    }

    public drawArrayLines(): void {
        this.gl.drawArrays(this.gl.LINES, 0, Math.floor(this.buffDataLen / 3));
    }

    public drawElementTriangles(): void {
        this.gl.drawElements(this.gl.TRIANGLES, this.buffDataLen, this.gl.UNSIGNED_SHORT, 0);
    }

    public drawElements(): void {
        this.gl.drawElements(this.gl.LINES, this.buffDataLen, this.gl.UNSIGNED_SHORT, 0);
    }
}

