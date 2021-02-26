import * as utils from "../utils/exports.js";

class EventManager {
    private static _instance: EventManager;
    public static getInstance(): EventManager {
        if (!this._instance) {
            this._instance = new EventManager();
        }
        return this._instance;
    }

    private _events: { [type: string]: { handler: Function, caller: Object }[] } = {};

    private _UpKeyDown: boolean = false;
    private _DownkeyDown: boolean = false;
    private _RightKeyDown: boolean = false;
    private _LeftKeyDown: boolean = false;
    private _RightMouseDown: boolean = false;

    private _shouldDispatchMouseMoveEvent: boolean = false;
    private _curPosX: number = 0;
    private _curPosY: number = 0;

    constructor() { }

    init() {
        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);
        document.addEventListener("mousedown", this.onMouseDown);
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("mousemove", this.onMouseMove);
        eventManager.startDispatchKeyDownEvent();
    }

    onKeyDown(this: Document, ev: KeyboardEvent): any {
        let value: string = ev.key;
        if (Object.values(DIRECT).indexOf(value as DIRECT) !== -1) {
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

    onKeyUp(this: Document, ev: KeyboardEvent): any {
        let value: string = ev.key;
        if (Object.values(DIRECT).indexOf(value as DIRECT) !== -1) {
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

    onMouseDown(this: Document, ev: MouseEvent): any {
        eventManager._RightMouseDown = true;
    }

    onMouseUp(this: Document, ev: MouseEvent): any {
        eventManager._RightMouseDown = false;
        eventManager._shouldDispatchMouseMoveEvent = false;
    }

    onMouseMove(this: Document, ev: MouseEvent): any {
        if (eventManager._RightMouseDown) {
            let oldX = eventManager._curPosX;
            let oldY = eventManager._curPosY;
            eventManager._curPosX = ev.x;
            eventManager._curPosY = ev.y;
            if (eventManager._shouldDispatchMouseMoveEvent) {
                let vector = new utils.Vec2(ev.x - oldX, ev.y - oldY);
                eventManager.dispatchEvent(new Event(DefaultEventType.RIGHT_MOUSE_DOWN_AND_MOVE, vector));
            } else {
                eventManager._shouldDispatchMouseMoveEvent = true;
            }
        }

    }

    startDispatchKeyDownEvent(): void {
        setInterval(() => {
            if (this._UpKeyDown) {
                this.dispatchEvent(new Event(DefaultEventType.UP_KEY_DOWN, DIRECT.UP));
            } else if (this._DownkeyDown) {
                this.dispatchEvent(new Event(DefaultEventType.DOWN_KEY_DOWN, DIRECT.DOWN));
            } else if (this._RightKeyDown) {
                this.dispatchEvent(new Event(DefaultEventType.RIGHT_KEY_DOWN, DIRECT.RIGHT));
            } else if (this._LeftKeyDown) {
                this.dispatchEvent(new Event(DefaultEventType.LEFT_KEY_DOWN, DIRECT.LEFT));
            }
        }, 1000 / 60);
    }

    addEventListener(type: string, handler: Function, caller: Object): void {
        if (!(handler instanceof Function) || !(type.length > 0)) {
            console.error("非法参数");
            return;
        }
        if (!this._events[type]) {
            this._events[type] = [];
        }
        this._events[type].push({ handler: handler, caller: caller });
    }

    dispatchEvent(event: Event): void {
        if (!this._events[event.type]) {
            return;
        }
        this._events[event.type].forEach(element => {
            element.handler.call(element.caller, event);
        });
    }
}

export class Event {
    type: string = "";
    data: any;

    constructor(type: string, data?: any) {
        this.type = type;
        this.data = data;
    }
}

export class DefaultEventType {
    public static UP_KEY_DOWN: string = "DefaultEventType_UP_KEY_DOWN";
    public static DOWN_KEY_DOWN: string = "DefaultEventType_DOWN_KEY_DOWN";
    public static RIGHT_KEY_DOWN: string = "DefaultEventType_RIGHT_KEY_DOWN";
    public static LEFT_KEY_DOWN: string = "DefaultEventType_LEFT_KEY_DOWN";
    public static RIGHT_MOUSE_DOWN_AND_MOVE: string = "DefaultEventType_RIGHT_MOUSE_DOWN_AND_MOVE";
}

export enum DIRECT {
    UP = 'w',
    DOWN = 's',
    RIGHT = 'd',
    LEFT = 'a'
}

export let eventManager = EventManager.getInstance();