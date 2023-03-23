import { AABB } from "../geometry/aabb.js";
import { renderableCompMgr } from "../pool/renderableCompMgr.js";
import { AABBModel } from "./webgl2/model/aabb_model.js";
import Webgl2Base from "./webgl2/shader/webgl2_base.js";
import webGLManager from "./webGLManager.js";
import { makeTranslation } from "./webglUtils.js";
import * as utils from "../utils/exports.js";
import { BaseNode } from "./webgl2/instance/baseNode.js";

export class BaseRenderableComp {
    public compType: RENDERABLE_COMP_TYPE = RENDERABLE_COMP_TYPE.NORMAL;

    public node: BaseNode;

    /**用来显示包围盒的着色器 */
    private _aabbShader: Webgl2Base;
    private _aabbModel: AABBModel;
    /**是否显示包围盒线框 */
    public showAABB: boolean = false;
    private _lineColor: utils.Color = new utils.Color(0, 255, 0, 0.5);

    constructor(type = RENDERABLE_COMP_TYPE.NORMAL) {
        this.compType = type;
        renderableCompMgr.registerRenderableComp(this);
        this._aabbShader = new Webgl2Base(this.getGL());
        this._aabbModel = new AABBModel();
    }

    public getGL(): WebGLRenderingContext {
        return webGLManager.getWebGLRenderingContext();
    }

    public update(dt?: number): void {
        if (this.showAABB) {
            this._aabbModel.updateVertexData(this.getAABB());
        }
    }

    public draw(): void {
        if (this.showAABB) {
            let camera = webGLManager.getCamera();
            let matWorld = makeTranslation(0, 0, 0);
            this._aabbShader.bindState();
            this._aabbShader.setBufferData(this._aabbModel.getVertexData());
            this._aabbShader.setBufferData(this._aabbModel.getIndicesData(), 2);
            this._aabbShader.setUniformAttribute(utils.Mat4.toArray([], camera.matViewProj), matWorld, this._lineColor.glRGBA(), matWorld);
            this._aabbShader.drawElements();
        }
    }

    public getAABB(): AABB {
        return null;
    }

    public destroy(): void {
        renderableCompMgr.deregisterRenderableComp(this);
    }
}

//TODO 这里的类型应该区分透明对象和不透明对象， 不然颜色混合时无法得到正确的结果。
export enum RENDERABLE_COMP_TYPE {
    NORMAL = 0,
    /**不参与常规渲染 */
    NO_RENDER = 1,
}

export enum RENDERABLE_COMP_SYSTEM_TYPE {
    COORDINATE_SYSTEM = 1,
    PARTICLE_SYSTEM,
    CUBE_SYSTEM,
    CLOTH_SYSTEM,
    FRAME_BUFFER_SYSTEM,
    HEAT_DIFFUSION_SYSTEM,
    CURVE_SYSTEM,
}


export let RENDERABLE_COMP_TYPES_ALL = [RENDERABLE_COMP_TYPE.NORMAL, RENDERABLE_COMP_TYPE.NO_RENDER];
/**除去NO_RENDER的所有剩余类型 */
export let RENDERABLE_COMP_TYPES_NORMAL_RENDER = [RENDERABLE_COMP_TYPE.NORMAL];