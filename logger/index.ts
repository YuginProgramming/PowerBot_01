/* eslint-disable no-console */
import { Log, LogFields } from "../models/logs";
import { LogLevelsEnum } from "../config/enum";
import { DateTime } from "luxon";

const DEBUG = true;

// 🗽✨🎈🌞⛵🎃🚸

class Logger {
    private now: string;
    constructor () {
        this.now = DateTime.now().toFormat('yy-MM-dd HH:mm:ss.SSS');
    }

    private createNewLog = async (channelId: number, description: string, level: LogLevelsEnum): Promise<LogFields|undefined> => {
        let res;
        try {
            res = await Log.create({ channel_id: channelId, description, level });
        } catch (err) {
            logger.error(`Impossible to create log: ${err}`);
        }
        if (res) {
    
            return res.dataValues;
        }
        return;
    };

    info = async (desc: string, channelId?: number): Promise<void> => {
        const channel = channelId === undefined ? -1 : channelId;
        const res = await this.createNewLog(channel, desc, LogLevelsEnum.info);
        if (res && DEBUG) {
            console.log(`🏂 ${this.now} ${desc}`);
        }
    };

    warn = async (desc: string, channelId?: number): Promise<void> => {
        const channel = channelId || -1;
        const res = await this.createNewLog(channel, desc, LogLevelsEnum.warn);
        if (res && DEBUG) {
            console.log(`🎈 ${this.now} ${desc}`);
        }
    };

    error = async (desc: string, channelId?: number): Promise<void> => {
        const channel = channelId || -1;
        const res = await this.createNewLog(channel, desc, LogLevelsEnum.error);
        if (res) {
            console.log(`🚩 ${this.now} ${desc}`);
        }
    };

}

const logger = new Logger();

export { logger };