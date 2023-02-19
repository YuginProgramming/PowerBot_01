import * as config from '../../config';
import { findAllStatusesByChannelIds, StatusFields } from '../../models/statuses';
import { StatusEnum } from '../../config/enum';
import { findChannelsByStatus } from '../../models/channels';
import { logger } from '../../logger';

const activeChannels = async (): Promise <Array<number>|undefined> => {
    const channels = await findChannelsByStatus(true);
    if (channels) return channels.map(item => item.id);
    logger.error('Can not read active channels');
    return;
};

const compareStatus = (recentStatus: StatusFields, actualStatus: StatusFields) => {
    if (actualStatus.status !== recentStatus.status && actualStatus.status === StatusEnum.on) {
        logger.info('[new status]: ON. ON CHANNEL: ' + actualStatus.channel_id, actualStatus.channel_id);
    }
    if (actualStatus.status !== recentStatus.status  && actualStatus.status === StatusEnum.off) {
        logger.info('[new status]: OFF. ON CHANNEL: ' + actualStatus.channel_id, actualStatus.channel_id);
    }
};
let recentStatus: Array<StatusFields> = [];

const crawlerFunc = async () => {
    let actualStatus;
    const ids = await activeChannels();
    if (ids) {
        const channelsStatuses = await findAllStatusesByChannelIds(ids);
        if (channelsStatuses) {
            actualStatus = channelsStatuses;
            actualStatus.forEach(item => {
                const recent = recentStatus.find(element => element.id === item.id);
                if (recent) compareStatus(recent, item);
            });
            recentStatus = actualStatus;
        }
    }
};

const crawlerSetIntervalId = setInterval(crawlerFunc, config.pinger.interval * 1000);

export {
    crawlerSetIntervalId
};

