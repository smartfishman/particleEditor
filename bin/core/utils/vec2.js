export class Vec2 {
    constructor(x, y) {
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x || 0;
            this.y = y || 0;
        }
    }
    /**
     * @zh 克隆当前向量。
     */
    clone() {
        return new Vec2(this.x, this.y);
    }
    set(x, y) {
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x || 0;
            this.y = y || 0;
        }
        return this;
    }
}
//# sourceMappingURL=vec2.js.map