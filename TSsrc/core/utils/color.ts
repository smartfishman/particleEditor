
export class Color {
    public R: number;
    public G: number;
    public B: number;
    public A: number;

    /**
     * 
     * @param HEX 十六进制
     */
    constructor(HEX: string);
    /**
     * RGB颜色
     * @param R 
     * @param G 
     * @param B 
     * @param A 透明度
     */
    constructor(R: number | string, G: number, B: number, A?: number);
    constructor(R: number | string, G?: number, B?: number, A?: number) {
        if (typeof R === "number") {
            this.R = R;
            this.G = G;
            this.B = B;
            this.A = A > 0 ? A : 1;
        }
    }

    public RGBA(): number[] {
        return [this.R, this.G, this.B, this.A];
    }

    public glRGBA(): number[] {
        return [this.R/255, this.G/255, this.B/255, this.A];
    }
}