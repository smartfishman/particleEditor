import { data as shaderAssetData } from "../../../../lib/shaderAssets/shaderAsset.js"
import * as webglUtils from "../webglUtils.js"

export default class Webgl2Base {
    private gl: WebGL2RenderingContext;
    private glProgram: WebGLProgram;

    private vertexShaderSource: string;
    private fragShaderSource: string;
    private vertexAttributeName: string;
    private matViewProjUniformName: string;
    private matWorldUniformName: string;
    private matWorld2UniformName: string;
    private colorUniformName: string;

    private vertexAttributeIndex: number;
    private matViewProjUniformIndex: WebGLUniformLocation;
    private matWorldUniformIndex: WebGLUniformLocation;
    private matWorld2UniformIndex: WebGLUniformLocation;
    private colorUniformIndex: WebGLUniformLocation;
    private buffDataLen: number;


    constructor(gl: WebGLRenderingContext) {
        this.gl = gl as WebGL2RenderingContext;
        this.vertexShaderSource = shaderAssetData.base_vert;
        this.fragShaderSource = shaderAssetData.base_frag;
        this.vertexAttributeName = "position";
        this.matViewProjUniformName = "matViewProj";
        this.matWorldUniformName = "matWorld";
        this.matWorld2UniformName = "matWorld2";
        this.colorUniformName = "color";
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
    }

    /**初始化顶点属性 */
    private initVertexAttribute(): void {
        this.vertexAttributeIndex = this.gl.getAttribLocation(this.glProgram, this.vertexAttributeName);
        this.gl.enableVertexAttribArray(this.vertexAttributeIndex);
        this.gl.vertexAttribPointer(this.vertexAttributeIndex, 3, this.gl.FLOAT, false, 0, 0);
    }

    private initUniformAttribute(): void {
        this.matViewProjUniformIndex = this.gl.getUniformLocation(this.glProgram, this.matViewProjUniformName);
        this.matWorldUniformIndex = this.gl.getUniformLocation(this.glProgram, this.matWorldUniformName);
        this.matWorld2UniformIndex = this.gl.getUniformLocation(this.glProgram, this.matWorld2UniformName);
        this.colorUniformIndex = this.gl.getUniformLocation(this.glProgram, this.colorUniformName);
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

    public setUniformAttribute(matViewProj: Float32List, matWorld: Float32List, color: Float32List,matWorld2: Float32List=[]): void {
        this.gl.uniformMatrix4fv(this.matViewProjUniformIndex, false, matViewProj);
        this.gl.uniformMatrix4fv(this.matWorldUniformIndex, false, matWorld);
        this.gl.uniformMatrix4fv(this.matWorld2UniformIndex, false, matWorld2);
        this.gl.uniform4fv(this.colorUniformIndex, color);
    }

    public bindState():void{
        this.gl.useProgram(this.glProgram);
        this.bindBuffer();
        this.initVertexAttribute();
        this.initUniformAttribute();
    }

    public draw(): void {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, Math.floor(this.buffDataLen / 3));
    }

    public drawArrayLines():void{
        this.gl.drawArrays(this.gl.LINES, 0, Math.floor(this.buffDataLen / 3));
    }

    public drawElements(): void {
        this.gl.drawElements(this.gl.LINES, this.buffDataLen, this.gl.UNSIGNED_SHORT, 0);
    }
}

