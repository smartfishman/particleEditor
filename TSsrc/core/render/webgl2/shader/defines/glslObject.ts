

export class UniformBlock {
    constructor(
        public binding: number = 0,
        public name: string = '',
        public members: Uniform[] = [],
    ) { }
}

export class Uniform {
    constructor(
        public name: string = '',
        public type: Type = Type.UNKNOWN,
    ) { }

    public copy(info: Uniform) {
        this.name = info.name;
        this.type = info.type;
        return this;
    }
}

export enum Type {
    UNKNOWN,
    FLOAT,
    FLOAT2,
    FLOAT3,
    FLOAT4,
    MAT2,
    MAT3,
    MAT4,
    COUNT,
}