import * as config from '../../config';
import { findAllStatusesByChannelIds, StatusFields } from '../../models/statuses';
import { findChannelsByStatus } from '../../models/channels';
import { logger } from '../../logger';
import { StatusEnum } from 'config/enum';

let statusesBefore: Array<StatusFields>;


const channels = async (): Promise <Array<number>|undefined> => {
    const channels = await findChannelsByStatus(true);
    if (channels) {
        const channelsIds = channels.map(item => item.id);
        return channelsIds;
    }  
    logger.error('Can not read active channels');
    return;
};

const initCheckStatus = async () => {
    const channelIds = await channels();
    if (channelIds) {
        const statuses = await findAllStatusesByChannelIds(channelIds);
        if (statuses) {
            statusesBefore = statuses;
        } else {
            logger.warn('Can not read statuses');
        }
    } else {
        logger.warn('Something went wrong. Can not read light status');
    }
};

initCheckStatus();

const compareStates = (statusesBefore: Array<StatusFields>, statusesAfter: Array<StatusFields>) => {
    return statusesAfter.filter(After => 
        statusesBefore.find(Before => Before.id === After.id).status !== After.status
    );
};

const crawlerFunc = async () => {
    let statusesAfter: Array<StatusFields>;
    const channelIds = await channels();
    if (channelIds) {
        const statuses = await findAllStatusesByChannelIds(channelIds);
        if (statuses) {
            statusesAfter = statuses;
            const newStates = compareStates(statusesBefore, statusesAfter);
            console.log(newStates);
        } else {
            logger.warn('Can not read statuses');
        }   
    } else {
        logger.warn('Something went wrong. Can not read light status');
    }
    
};

const crawlerSetIntervalId = setInterval(crawlerFunc, config.pinger.interval * 1000);

export {
    crawlerSetIntervalId
};

