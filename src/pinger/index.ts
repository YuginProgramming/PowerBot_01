import * as config from '../../config';
import { updateStatusByChannelId } from '../../models/statuses';
import { StatusEnum } from '../../config/enum';
import { findChannelsByStatus } from '../../models/channels';
import { Pinger, PingerFields, findIpsByChannelId } from '../../models/pingers';
import { logger } from '../../logger';
import * as ping from 'ping';

const activeChannels = async (): Promise <Array<number>|undefined> => {
    const channels = await findChannelsByStatus(true);
    if (channels) return channels.map(item => item.id);
    logger.info('No active channels exist');
    return;
};

//зараз я використовую функцію findIpsByChannelId з пінгера для пошуку активних айпішників
// const findIpsForActiveChannels = async (): Promise<string[]> => {
//     const activeChannelIds = await activeChannels();
//     const ips = await Pinger.findAll({
//         where: { channel_id: activeChannelIds },
//         attributes: ['value']
//     }) as PingerInstance[];
//     return ips.map(ip => ip.value);
// };

const findIpsForActiveChannels = async (): Promise<PingerFields[] | undefined> => {
    const activeChannelIds = await activeChannels();
    const ips = await findIpsByChannelId(activeChannelIds || []);
    return ips;
};
  
const pingerFunc = async (): Promise<unknown[]> => {
    const hosts = await findIpsForActiveChannels();
    const pingResults = [];

    if (hosts !== undefined) {
        for (const host of hosts.map((pingerFields) => pingerFields.value)) {
            console.log(host);
            const res = await ping.promise.probe(host);
            const ipStatus = res.alive;
            const status = ipStatus ? StatusEnum.on : StatusEnum.off;

            // Fetch the channel ID for the current IP
            const channel = await Pinger.findOne({
                where: { value: host },
                attributes: ['channel_id']
            });

            const resultArr = {
                channel: channel ? channel.channel_id : null,
                ip: host,
                status: status
            };
            //console.log(resultArr);
            pingResults.push(resultArr);

            // Update the status of the channel if it exists
            if (channel) {
                await updateStatusByChannelId(channel.channel_id, status);
            }
        }
    }
    return pingResults;
};

pingerFunc();

//const pingerSetIntervalId = setInterval(pingerFunc, config.pinger.interval * 1000);

export {
  //  pingerSetIntervalId
};
