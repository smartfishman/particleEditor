export class UniformBlock {
    constructor(binding = 0, name = '', members = []) {
        this.binding = binding;
        this.name = name;
        this.members = members;
    }
}
export class Uniform {
    constructor(name = '', type = Type.UNKNOWN) {
        this.name = name;
        this.type = type;
    }
    copy(info) {
        this.name = info.name;
        this.type = info.type;
        return this;
    }
}
export var Type;
(function (Type) {
    Type[Type["UNKNOWN"] = 0] = "UNKNOWN";
    Type[Type["FLOAT"] = 1] = "FLOAT";
    Type[Type["FLOAT2"] = 2] = "FLOAT2";
    Type[Type["FLOAT3"] = 3] = "FLOAT3";
    Type[Type["FLOAT4"] = 4] = "FLOAT4";
    Type[Type["MAT2"] = 5] = "MAT2";
    Type[Type["MAT3"] = 6] = "MAT3";
    Type[Type["MAT4"] = 7] = "MAT4";
    Type[Type["COUNT"] = 8] = "COUNT";
})(Type || (Type = {}));
//# sourceMappingURL=glslObject.js.map