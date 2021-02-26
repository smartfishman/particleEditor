export class Color {
    constructor(R, G, B, A) {
        if (typeof R === "number") {
            this.R = R;
            this.G = G;
            this.B = B;
            this.A = A > 0 ? A : 1;
        }
    }
    RGBA() {
        return [this.R, this.G, this.B, this.A];
    }
    glRGBA() {
        return [this.R / 255, this.G / 255, this.B / 255, this.A];
    }
}
//# sourceMappingURL=color.js.map