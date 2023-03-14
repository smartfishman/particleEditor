import { Uniform, UniformBlock, Type } from "./glslObject.js";

/**
 * @en The uniform bindings
 * @zh Uniform 参数绑定。
 */
export enum PipelineGlobalBindings{
    UBO_CAMERA,
    UBO_GLOBAL,
    UBO_LOCAL,
    COUNT,
}

export class UBOCamera {
    public static MAT_VIEW_PROJ_OFFSET = 0;
    public static LIGHT_COLOR_OFFSET = UBOCamera.MAT_VIEW_PROJ_OFFSET + 16;
    public static LIGHT_POS_OFFSET = UBOCamera.LIGHT_COLOR_OFFSET + 4;
    public static VIEW_POS_OFFSET = UBOCamera.LIGHT_POS_OFFSET + 4;
    public static COUNT = UBOCamera.VIEW_POS_OFFSET + 4;
    public static SIZE = UBOCamera.COUNT * 4;

    public static NAME = "AAACamera";
    public static readonly BINDING = PipelineGlobalBindings.UBO_CAMERA;
    public static readonly LAYOUT = new UniformBlock(UBOCamera.BINDING, UBOCamera.NAME, [
        new Uniform('matViewProj', Type.MAT4),
        new Uniform('lightColor', Type.FLOAT3),
        new Uniform('lightPos', Type.FLOAT3),
        new Uniform('viewPos', Type.FLOAT3),
    ]);
}

export class UBOLocal {
    public static MAT_WORLD_OFFSET = 0;
    public static COUNT = UBOLocal.MAT_WORLD_OFFSET + 16;
    public static SIZE = UBOLocal.COUNT * 4;

    public static NAME = "AAALocal";
    public static readonly BINDING = PipelineGlobalBindings.UBO_LOCAL;
    public static readonly LAYOUT = new UniformBlock(UBOLocal.BINDING, UBOLocal.NAME, [
        new Uniform('matWorld', Type.MAT4),
    ]);
}