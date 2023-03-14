import webGLManager from "../render/webGLManager.js";
export default class Utils {
    static windowPointToCanvas(out, point) {
        let canvas = webGLManager.getCanvas();
        out.x = point.x - canvas.offsetLeft;
        out.y = canvas.offsetTop + canvas.height - point.y;
        return out;
    }
    static makeTranslation(tx, ty, tz) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ];
    }
}
//# sourceMappingURL=utils.js.map