import webGLManager from "../render/webGLManager.js";
export default class Utils {
    static windowPointToCanvas(out, point) {
        let canvas = webGLManager.getCanvas();
        out.x = point.x - canvas.offsetLeft;
        out.y = canvas.offsetTop + canvas.height - point.y;
        return out;
    }
}
//# sourceMappingURL=utils.js.map