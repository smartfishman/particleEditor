import { Uniform, UniformBlock, Type } from "./glslObject.js";
/**
 * @en The uniform bindings
 * @zh Uniform 参数绑定。
 */
export var PipelineGlobalBindings;
(function (PipelineGlobalBindings) {
    PipelineGlobalBindings[PipelineGlobalBindings["UBO_CAMERA"] = 0] = "UBO_CAMERA";
    PipelineGlobalBindings[PipelineGlobalBindings["UBO_GLOBAL"] = 1] = "UBO_GLOBAL";
    PipelineGlobalBindings[PipelineGlobalBindings["UBO_LOCAL"] = 2] = "UBO_LOCAL";
    PipelineGlobalBindings[PipelineGlobalBindings["COUNT"] = 3] = "COUNT";
})(PipelineGlobalBindings || (PipelineGlobalBindings = {}));
export class UBOCamera {
}
UBOCamera.MAT_VIEW_PROJ_OFFSET = 0;
UBOCamera.LIGHT_COLOR_OFFSET = UBOCamera.MAT_VIEW_PROJ_OFFSET + 16;
UBOCamera.LIGHT_POS_OFFSET = UBOCamera.LIGHT_COLOR_OFFSET + 4;
UBOCamera.VIEW_POS_OFFSET = UBOCamera.LIGHT_POS_OFFSET + 4;
UBOCamera.COUNT = UBOCamera.VIEW_POS_OFFSET + 4;
UBOCamera.SIZE = UBOCamera.COUNT * 4;
UBOCamera.NAME = "AAACamera";
UBOCamera.BINDING = PipelineGlobalBindings.UBO_CAMERA;
UBOCamera.LAYOUT = new UniformBlock(UBOCamera.BINDING, UBOCamera.NAME, [
    new Uniform('matViewProj', Type.MAT4),
    new Uniform('lightColor', Type.FLOAT3),
    new Uniform('lightPos', Type.FLOAT3),
    new Uniform('viewPos', Type.FLOAT3),
]);
export class UBOLocal {
}
UBOLocal.MAT_WORLD_OFFSET = 0;
UBOLocal.COUNT = UBOLocal.MAT_WORLD_OFFSET + 16;
UBOLocal.SIZE = UBOLocal.COUNT * 4;
UBOLocal.NAME = "AAALocal";
UBOLocal.BINDING = PipelineGlobalBindings.UBO_LOCAL;
UBOLocal.LAYOUT = new UniformBlock(UBOLocal.BINDING, UBOLocal.NAME, [
    new Uniform('matWorld', Type.MAT4),
]);
//# sourceMappingURL=constantsDefine.js.map