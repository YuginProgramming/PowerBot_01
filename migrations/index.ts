import { StatusEnum } from '../config/enum';
import { Status, createStatus } from '../model/statuses';
import { logger } from '../logger';
import { Log } from '../model/logs';


Status.sync().then(() => createStatus(55, StatusEnum.off));

Log.sync().then(() => logger.info('Log created by migration procedure'));

// Channel.sync();

// Pinger.sync();