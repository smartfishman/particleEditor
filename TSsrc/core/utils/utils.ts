import webGLManager from "../render/webGLManager.js";

export default class Utils {
    public static windowPointToCanvas(out: { x: number, y: number }, point: { x: number, y: number }): { x: number, y: number } {
        let canvas = webGLManager.getCanvas();
        out.x = point.x - canvas.offsetLeft;
        out.y = canvas.offsetTop + canvas.height - point.y;
        return out;
    }

    public static makeTranslation(tx, ty, tz): number[] {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ];
    }
}