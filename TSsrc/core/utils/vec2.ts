export class Vec2 {
    /**
     * x 分量。
     */
    public declare x: number;

    /**
     * y 分量。
     */
    public declare y: number;

    constructor(other: Vec2);

    constructor(x?: number, y?: number);

    constructor(x?: number | Vec2, y?: number) {
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x as number || 0;
            this.y = y || 0;
        }
    }

    /**
     * @zh 克隆当前向量。
     */
    public clone() {
        return new Vec2(this.x, this.y);
    }

    /**
     * @zh 设置当前向量使其与指定向量相等。
     * @param other 相比较的向量。
     * @return `this`
     */
    public set(other: Vec2);

    /**
     * @zh 设置当前向量的具体分量值。
     * @param x 要设置的 x 分量的值
     * @param y 要设置的 y 分量的值
     * @return `this`
     */
    public set(x?: number, y?: number);

    public set(x?: number | Vec2, y?: number) {
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x as number || 0;
            this.y = y || 0;
        }
        return this;
    }
}