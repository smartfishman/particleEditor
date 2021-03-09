import { data as shaderAssetData } from "../../../../lib/shaderAssets/shaderAsset.js"
import * as webglUtils from "../webglUtils.js"

export default class Webgl2Cube {
    private gl: WebGL2RenderingContext;
    private glProgram: WebGLProgram;

    private vertexShaderSource: string;
    private fragShaderSource: string;
    private vertexAttributeName1: string;
    private vertexAttributeName2: string;
    private vertexAttributeName3: string;
    private matViewProjUniformName: string;
    private matWorldUniformName: string;
    private lightColorUniformName: string;
    private imageUniformName: string;

    private matViewProjUniformIndex: WebGLUniformLocation;
    private matWorldUniformIndex: WebGLUniformLocation;
    private lightColorUniformIndex: WebGLUniformLocation;


    private image: HTMLImageElement;
    private buffDataLen: number;

    private glArrayBuffer: WebGLBuffer;
    private glElementBuffer: WebGLBuffer;
    private glTexture: WebGLTexture;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl as WebGL2RenderingContext;
        this.vertexShaderSource = shaderAssetData["standard/standard_vert"];
        this.fragShaderSource = shaderAssetData["standard/standard_frag"];
        this.vertexAttributeName1 = "a_position";
        this.vertexAttributeName2 = "a_texcoord";
        this.vertexAttributeName3 = "a_normalVector";
        this.matViewProjUniformName = "matViewProj";
        this.matWorldUniformName = "matWorld";
        this.lightColorUniformName = "lightColor";
        this.imageUniformName = "u_image2";
        this.initShader();
    }

    /**初始化着色器 */
    private initShader(): void {
        let vertexShader = webglUtils.createShader(this.gl, this.gl.VERTEX_SHADER, this.vertexShaderSource);
        let fragShader = webglUtils.createShader(this.gl, this.gl.FRAGMENT_SHADER, this.fragShaderSource);
        this.glProgram = webglUtils.createProgram(this.gl, vertexShader, fragShader);
        this.glArrayBuffer = this.gl.createBuffer();
        this.glElementBuffer = this.gl.createBuffer();
        this.glTexture = this.gl.createTexture();

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);

        // 开启混合
        this.gl.enable(this.gl.BLEND);
        // 设定混合效果
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }

    private bindBuffer(): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glArrayBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.glElementBuffer);
    }

    /**初始化顶点属性 */
    private initVertexAttribute(): void {
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

    private initUniformAttribute(): void {
        this.matViewProjUniformIndex = this.gl.getUniformLocation(this.glProgram, this.matViewProjUniformName);
        this.matWorldUniformIndex = this.gl.getUniformLocation(this.glProgram, this.matWorldUniformName);
        this.lightColorUniformIndex = this.gl.getUniformLocation(this.glProgram, this.lightColorUniformName);
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

    public setUniformAttribute(matViewProj: Float32List, matWorld: Float32List): void {
        this.gl.uniformMatrix4fv(this.matViewProjUniformIndex, false, matViewProj);
        this.gl.uniformMatrix4fv(this.matWorldUniformIndex, false, matWorld);
        this.gl.uniform3fv(this.lightColorUniformIndex, [1, 1, 1]);
    }

    private bindTexture(image: TexImageSource, textureUnitsOffset: number, textureObjects: number, uniformLoc: WebGLUniformLocation, glTexture: WebGLTexture): void {
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
        this.gl.useProgram(this.glProgram);
        this.bindBuffer();
        this.initVertexAttribute();
        this.initUniformAttribute();
    }

    private _drawEnable: boolean = false;
    public draw(): void {
        this._drawEnable = true;
        this.doDraw();
    }

    private _imageLoadIndex = 1;
    private doDraw(): void {
        if (!this._drawEnable) {
            return;
        }
        if (!this.image) {
            this.image = new Image();
            this.image.src = "http://localhost:3000/images/timg.jpg";
            this.image.onload = () => {
                this._imageLoadIndex--;
                let loc = this.gl.getUniformLocation(this.glProgram, this.imageUniformName);
                this.bindTexture(this.image, 1, this.gl.TEXTURE_2D, loc, this.glTexture);
                this.doDraw();
            };
            return;
        }
        if (this._imageLoadIndex <= 0) {
            this.gl.drawElements(this.gl.TRIANGLES, this.buffDataLen, this.gl.UNSIGNED_SHORT, 0);
        }
    }
}