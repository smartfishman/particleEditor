import { intersect } from "../geometry/intersect.js";
import { RENDERABLE_COMP_SYSTEM_TYPE, RENDERABLE_COMP_TYPES_NORMAL_RENDER } from "../render/baseRenderableComp.js";
import { WebGL2CoordinateSystem } from "../render/webgl2/instance/coordinate/webGL2CoordinateSystem.js";
import { Webgl2CubeSystem } from "../render/webgl2/instance/cube/cubeSystem.js";
import { WebGL2TestFrameBufferSystem } from "../render/webgl2/instance/frameBuffer/webGL2TestFrameBufferSystem.js";
import { WebGl2ParticleSystem } from "../render/webgl2/instance/particle/webGL2ParticleSystem.js";
class RenderableCompManager {
    constructor() {
        this._registeredCompList = {};
    }
    static getInstance() {
        if (!RenderableCompManager._instance) {
            RenderableCompManager._instance = new RenderableCompManager();
        }
        return RenderableCompManager._instance;
    }
    createCompBySystemType(type) {
        let comp;
        switch (type) {
            case RENDERABLE_COMP_SYSTEM_TYPE.COORDINATE_SYSTEM:
                comp = new WebGL2CoordinateSystem();
                break;
            case RENDERABLE_COMP_SYSTEM_TYPE.PARTICLE_SYSTEM:
                comp = new WebGl2ParticleSystem();
                break;
            case RENDERABLE_COMP_SYSTEM_TYPE.CUBE_SYSTEM:
                comp = new Webgl2CubeSystem();
                break;
            case RENDERABLE_COMP_SYSTEM_TYPE.FRAME_BUFFER_SYSTEM:
                comp = new WebGL2TestFrameBufferSystem();
                break;
            default:
                break;
        }
        return comp;
    }
    registerRenderableComp(comp) {
        if (!this._registeredCompList[comp.compType]) {
            this._registeredCompList[comp.compType] = [];
        }
        if (this._registeredCompList[comp.compType].indexOf(comp) === -1) {
            this._registeredCompList[comp.compType].push(comp);
        }
    }
    deregisterRenderableComp(comp) {
        if (!this.registerRenderableComp[comp.compType]) {
            return;
        }
        let index = this.registerRenderableComp[comp.compType].indexOf(comp);
        if (index >= 0) {
            this._registeredCompList[comp.compType].splice(index, 1);
        }
    }
    getAllRenderableCompByType(types = RENDERABLE_COMP_TYPES_NORMAL_RENDER) {
        let result = [];
        types.forEach(type => {
            if (this._registeredCompList[type]) {
                result = result.concat(this._registeredCompList[type]);
            }
        });
        return result;
    }
    /**获取射线穿过的第一个组件 */
    checkNearestIntersectByRay(ray, types = RENDERABLE_COMP_TYPES_NORMAL_RENDER) {
        let results = [];
        types.forEach(type => {
            if (this._registeredCompList[type]) {
                this._registeredCompList[type].forEach(renderableComp => {
                    let aabb = renderableComp.getAABB();
                    if (aabb) {
                        let flag = intersect.rayAABB(ray, aabb);
                        if (flag > 0) {
                            let temp = {};
                            temp.distance = flag;
                            temp.comp = renderableComp;
                            results.push(temp);
                        }
                    }
                });
            }
        });
        results.sort((a, b) => {
            return a.distance - b.distance;
        });
        return results[0] && results[0].comp;
    }
}
export let renderableCompMgr = RenderableCompManager.getInstance();
//# sourceMappingURL=renderableCompMgr.js.map