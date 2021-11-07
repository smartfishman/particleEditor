import { intersect } from "../geometry/intersect.js";
import { Ray } from "../geometry/ray.js";
import { BaseRenderableComp, RENDERABLE_COMP_SYSTEM_TYPE, RENDERABLE_COMP_TYPE, RENDERABLE_COMP_TYPES_NORMAL_RENDER } from "../render/baseRenderableComp.js";
import { Webgl2ClothSystem } from "../render/webgl2/instance/cloth/clothSystem.js";
import { WebGL2CoordinateSystem } from "../render/webgl2/instance/coordinate/webGL2CoordinateSystem.js";
import { Webgl2CubeSystem } from "../render/webgl2/instance/cube/cubeSystem.js";
import { WebGL2TestFrameBufferSystem } from "../render/webgl2/instance/frameBuffer/webGL2TestFrameBufferSystem.js";
import { WebGl2ParticleSystem } from "../render/webgl2/instance/particle/webGL2ParticleSystem.js";
import { Vec3 } from "../utils/vec3.js";

class RenderableCompManager {
    private static _instance: RenderableCompManager;
    public static getInstance(): RenderableCompManager {
        if (!RenderableCompManager._instance) {
            RenderableCompManager._instance = new RenderableCompManager();
        }
        return RenderableCompManager._instance;
    }

    public createCompBySystemType(type: RENDERABLE_COMP_SYSTEM_TYPE): BaseRenderableComp {
        let comp: BaseRenderableComp;
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
            case RENDERABLE_COMP_SYSTEM_TYPE.CLOTH_SYSTEM:
                comp = new Webgl2ClothSystem();
                break;
            case RENDERABLE_COMP_SYSTEM_TYPE.FRAME_BUFFER_SYSTEM:
                comp = new WebGL2TestFrameBufferSystem();
                break;
            default:
                break;
        }
        return comp
    }

    private _registeredCompList: { [key: number]: BaseRenderableComp[] } = {};
    public registerRenderableComp(comp: BaseRenderableComp): void {
        if (!this._registeredCompList[comp.compType]) {
            this._registeredCompList[comp.compType] = [];
        }
        if (this._registeredCompList[comp.compType].indexOf(comp) === -1) {
            this._registeredCompList[comp.compType].push(comp);
        }
    }

    public deregisterRenderableComp(comp: BaseRenderableComp): void {
        if (!this.registerRenderableComp[comp.compType]) {
            return;
        }
        let index = this.registerRenderableComp[comp.compType].indexOf(comp);
        if (index >= 0) {
            this._registeredCompList[comp.compType].splice(index, 1);
        }
    }

    public getAllRenderableCompByType(types: RENDERABLE_COMP_TYPE[] = RENDERABLE_COMP_TYPES_NORMAL_RENDER): BaseRenderableComp[] {
        let result = [];
        types.forEach(type => {
            if (this._registeredCompList[type]) {
                result = result.concat(this._registeredCompList[type]);
            }
        });
        return result;
    }

    /**获取射线穿过的第一个组件 */
    public checkNearestIntersectByRay(ray: Ray, types: RENDERABLE_COMP_TYPE[] = RENDERABLE_COMP_TYPES_NORMAL_RENDER): BaseRenderableComp {
        let results: { distance: number, comp: BaseRenderableComp }[] = [];
        types.forEach(type => {
            if (this._registeredCompList[type]) {
                this._registeredCompList[type].forEach(renderableComp => {
                    let aabb = renderableComp.getAABB();
                    if (aabb) {
                        let flag = intersect.rayAABB(ray, aabb);
                        if (flag > 0) {
                            let temp = {} as { distance: number, comp: BaseRenderableComp };
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

    public checkAnyBoxContainTarget(target: Vec3, excludeComps: BaseRenderableComp[] = []): boolean {
        let types: RENDERABLE_COMP_TYPE[] = RENDERABLE_COMP_TYPES_NORMAL_RENDER;
        for (let index = 0; index < types.length; index++) {
            let type = types[index];
            if (this._registeredCompList[type]) {
                for (let k = 0; k < this._registeredCompList[type].length; k++) {
                    let comp = this._registeredCompList[type][k];
                    if (excludeComps.indexOf(comp) === -1) {
                        let aabb = comp.getAABB();
                        if (aabb && aabb.contain(target)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}

export let renderableCompMgr = RenderableCompManager.getInstance();