import { StatusEnum } from '../config/enum';
import { Status, createStatus } from '../models/statuses';
import { logger } from '../logger';
import { Log } from '../models/logs';


const pseudoRandom = () => Math.floor(Math.random() * 10000);
Status.sync().then(() => createStatus(pseudoRandom(), StatusEnum.off));

Log.sync().then(() => logger.info('Log created by migration procedure'));

// Channel.sync();

// Pinger.sync();