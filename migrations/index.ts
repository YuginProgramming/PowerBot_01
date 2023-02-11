import { StatusEnum } from '../config/enum';
import { Status, createStatus } from '../models/statuses';
import { Channel,  ChannelData, createNewChannel } from '../models/channels';
import { Pinger, addNewIp} from '../models/pingers';
import { logger } from '../logger';
import { Log } from '../models/logs';

const DEBUG = true;

const main = async (): Promise<void> => {
    try {
        const syncState = await Promise.all([
            Status.sync(),
            Log.sync(),
            Channel.sync(),
            Pinger.sync()
        ]);
        
        if (DEBUG && syncState) {
            const pseudoRandom = () => Math.floor(Math.random() * 10000);
            const channelData: ChannelData = {
                pinger_id: pseudoRandom(),
                shortname: 'migration_record',
                tg_id: pseudoRandom().toString()
            };

            createStatus(pseudoRandom(), StatusEnum.off);
            logger.info('Log created by migration procedure');
            createNewChannel(channelData);
            addNewIp('192.168.1.1', 634234533);
        }

    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
};

main();
