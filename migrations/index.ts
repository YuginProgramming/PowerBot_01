import { StatusEnum, LogLevelsEnum } from '../config/enum';
import { Status, createStatus } from '../model/statuses';
import { createNewLog } from '../model/logs';
import { Log } from '../model/logs';
Status.sync();
createStatus(55, StatusEnum.off);

Log.sync();
createNewLog(11, 'New record by migration', LogLevelsEnum.info);

// Channel.sync();

// Pinger.sync();