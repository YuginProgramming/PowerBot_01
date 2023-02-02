import { StatusEnum } from '../config/enum';
import { Status, createStatus } from '../model/statuses';

Status.sync();
createStatus(55, StatusEnum.off);

// Log.sync();

// Channel.sync();

// Pinger.sync();