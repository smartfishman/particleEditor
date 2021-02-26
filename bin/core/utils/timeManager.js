class TimeManager {
    constructor() {
        let date = new Date();
        this.startTime = date.valueOf();
    }
    static getInstance() {
        if (!TimeManager._instance) {
            TimeManager._instance = new TimeManager();
        }
        return TimeManager._instance;
    }
    /**获取游戏启动后的总时间 */
    getTime() {
        let date = new Date();
        return date.valueOf() - this.startTime;
    }
}
export let timeManager = TimeManager.getInstance();
//# sourceMappingURL=timeManager.js.map