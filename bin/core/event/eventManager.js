import * as utils from "../utils/exports.js";
class EventManager {
    constructor() {
        this._events = {};
        this._UpKeyDown = false;
        this._DownkeyDown = false;
        this._RightKeyDown = false;
        this._LeftKeyDown = false;
        this._RightMouseDown = false;
        this._shouldDispatchMouseMoveEvent = false;
        this._curPosX = 0;
        this._curPosY = 0;
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new EventManager();
        }
        return this._instance;
    }
    init() {
        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);
        document.addEventListener("mousedown", this.onMouseDown);
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("mousemove", this.onMouseMove);
        eventManager.startDispatchKeyDownEvent();
    }
    onKeyDown(ev) {
        let value = ev.key;
        if (Object.values(DIRECT).indexOf(value) !== -1) {
            eventManager._UpKeyDown = false;
            eventManager._DownkeyDown = false;
            eventManager._RightKeyDown = false;
            eventManager._LeftKeyDown = false;
            switch (value) {
                case DIRECT.UP:
                    eventManager._UpKeyDown = true;
                    break;
                case DIRECT.DOWN:
                    eventManager._DownkeyDown = true;
                    break;
                case DIRECT.RIGHT:
                    eventManager._RightKeyDown = true;
                    break;
                case DIRECT.LEFT:
                    eventManager._LeftKeyDown = true;
                    break;
            }
        }
    }
    onKeyUp(ev) {
        let value = ev.key;
        if (Object.values(DIRECT).indexOf(value) !== -1) {
            switch (value) {
                case DIRECT.UP:
                    eventManager._UpKeyDown = false;
                    break;
                case DIRECT.DOWN:
                    eventManager._DownkeyDown = false;
                    break;
                case DIRECT.RIGHT:
                    eventManager._RightKeyDown = false;
                    break;
                case DIRECT.LEFT:
                    eventManager._LeftKeyDown = false;
                    break;
            }
        }
    }
    onMouseDown(ev) {
        eventManager._RightMouseDown = true;
    }
    onMouseUp(ev) {
        eventManager._RightMouseDown = false;
        eventManager._shouldDispatchMouseMoveEvent = false;
    }
    onMouseMove(ev) {
        if (eventManager._RightMouseDown) {
            let oldX = eventManager._curPosX;
            let oldY = eventManager._curPosY;
            eventManager._curPosX = ev.x;
            eventManager._curPosY = ev.y;
            if (eventManager._shouldDispatchMouseMoveEvent) {
                let vector = new utils.Vec2(ev.x - oldX, ev.y - oldY);
                eventManager.dispatchEvent(new Event(DefaultEventType.RIGHT_MOUSE_DOWN_AND_MOVE, vector));
            }
            else {
                eventManager._shouldDispatchMouseMoveEvent = true;
            }
        }
    }
    startDispatchKeyDownEvent() {
        setInterval(() => {
            if (this._UpKeyDown) {
                this.dispatchEvent(new Event(DefaultEventType.UP_KEY_DOWN, DIRECT.UP));
            }
            else if (this._DownkeyDown) {
                this.dispatchEvent(new Event(DefaultEventType.DOWN_KEY_DOWN, DIRECT.DOWN));
            }
            else if (this._RightKeyDown) {
                this.dispatchEvent(new Event(DefaultEventType.RIGHT_KEY_DOWN, DIRECT.RIGHT));
            }
            else if (this._LeftKeyDown) {
                this.dispatchEvent(new Event(DefaultEventType.LEFT_KEY_DOWN, DIRECT.LEFT));
            }
        }, 1000 / 60);
    }
    addEventListener(type, handler, caller) {
        if (!(handler instanceof Function) || !(type.length > 0)) {
            console.error("非法参数");
            return;
        }
        if (!this._events[type]) {
            this._events[type] = [];
        }
        this._events[type].push({ handler: handler, caller: caller });
    }
    dispatchEvent(event) {
        if (!this._events[event.type]) {
            return;
        }
        this._events[event.type].forEach(element => {
            element.handler.call(element.caller, event);
        });
    }
}
export class Event {
    constructor(type, data) {
        this.type = "";
        this.type = type;
        this.data = data;
    }
}
export class DefaultEventType {
}
DefaultEventType.UP_KEY_DOWN = "DefaultEventType_UP_KEY_DOWN";
DefaultEventType.DOWN_KEY_DOWN = "DefaultEventType_DOWN_KEY_DOWN";
DefaultEventType.RIGHT_KEY_DOWN = "DefaultEventType_RIGHT_KEY_DOWN";
DefaultEventType.LEFT_KEY_DOWN = "DefaultEventType_LEFT_KEY_DOWN";
DefaultEventType.RIGHT_MOUSE_DOWN_AND_MOVE = "DefaultEventType_RIGHT_MOUSE_DOWN_AND_MOVE";
export var DIRECT;
(function (DIRECT) {
    DIRECT["UP"] = "w";
    DIRECT["DOWN"] = "s";
    DIRECT["RIGHT"] = "d";
    DIRECT["LEFT"] = "a";
})(DIRECT || (DIRECT = {}));
export let eventManager = EventManager.getInstance();
//# sourceMappingURL=eventManager.js.map