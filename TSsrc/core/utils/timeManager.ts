class TimeManager {
    private static _instance: TimeManager;
    public static getInstance(): TimeManager {
        if (!TimeManager._instance) {
            TimeManager._instance = new TimeManager();
        }
        return TimeManager._instance;
    }

    private startTime: number;

    constructor() {
        let date = new Date();
        this.startTime = date.valueOf();
    }

    /**获取游戏启动后的总时间 */
    getTime(): number {
        let date = new Date();
        return date.valueOf() - this.startTime;
    }
}

export let timeManager = TimeManager.getInstance();