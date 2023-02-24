import { Model, DataTypes } from 'sequelize';
import { PingerTypeEnum, StatusEnum } from '../config/enum';
import { sequelize } from './sequelize';
import { logger } from '../logger';
import { findAllChannelIdsByStatus, updateStatusByChannelId } from './statuses';
const ping = require('ping');

class Pinger extends Model {}
Pinger.init({
    type: {
        type: DataTypes.ENUM(...Object.values(PingerTypeEnum)),
        allowNull: false
    },
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: false,
    timestamps: false,
    modelName: 'pingers',
    sequelize
});

interface PingerFields {
    id: number,
    type: PingerTypeEnum,
    channel_id: number,
    value: string
}

interface PingerInstance extends Model<PingerFields>, PingerFields {}
interface PingerInstance extends Model<PingerFields>, PingerFields {
    dataValues: PingerFields;
  }
  

const addNewIp = async (value: string, channel_id: number): Promise<PingerFields|undefined> => {
    let res;
    try {
        res = await Pinger.create({ type: PingerTypeEnum.ip, value, channel_id });
        res = res.dataValues;
        logger.info(`added new IP to DB with id: ${res.id}`);
    } catch (err) {
        logger.error(`Impossible added new IP: ${err}`);
    }
    return res;
};

const findIpsByChannelId = async (channel_id: number): Promise<PingerFields[]|undefined> => {
    let res;
    res = await Pinger.findAll({ 
        where: { channel_id, type: PingerTypeEnum.ip } 
    });
    res = res.map(i => i.dataValues);
    //logger.info(`Found ${res.length} Values: ${res.map(i => i.value).join(', ')} IP(s) for channel_id: ${channel_id}`);
    console.log(`Found ${res.length} Values: ${res.map(i => i.value).join(', ')} IP(s) for channel_id: ${channel_id}`);
    return res;
};

const updateIpByPingerId = async (id: number, value: string) : Promise<PingerFields|undefined> => {
    const res = await Pinger.update({ value: value }, { where: { id, type: PingerTypeEnum.ip } });
    if (res[0]) {
        const pinger = await Pinger.findOne({ where: { id } });
        logger.info(`Updated ip in pinger id ${id}`);
        return pinger?.dataValues;
    }
    return;
};

async function deleteIpByPingerId (id: number): Promise<boolean> {
    const res = await Pinger.destroy({ where: { id } });
    if (res) logger.info(`Deleted ip ${res}`);
    return res ? true : false;
}
    
const findAllIps = async (): Promise<PingerFields[] | undefined> => {
    let res;
    res = await Pinger.findAll();
    res = res.map(i => i.dataValues);
    return res;
};

const findIPsForActiveChannels = async (): Promise<string[]> => {
    const activeChannelIds = await findAllChannelIdsByStatus(StatusEnum.on);
    const ips = await Pinger.findAll({
        where: { channel_id: activeChannelIds },
        attributes: ['value']
    }) as PingerInstance[];
    return ips.map(ip => ip.value);
};
  
const pingIps = async () => {
    const hosts = await findIPsForActiveChannels();
    if (!hosts) {
        console.log('No hosts found');
        return;
    }
    for (const host of hosts) {
        const res = await ping.promise.probe(host);
        const ipStatus = res.alive;
        console.log(`${host} is ${ipStatus ? 'alive' : 'dead'}`);
    }
};

const pingIpsAndUpdateStatus = async () => {
    const hosts = await findIPsForActiveChannels();
    if (!hosts) {
        console.log('No hosts found');
        return;
    }
  
    const pingPromises = hosts.map(async host => {
        const res = await ping.promise.probe(host);
        const ipStatus = res.alive;
        const channelId = await findChannelIdByIp(host);
        const status = ipStatus ? StatusEnum.on : StatusEnum.off;
        const updated = channelId && await updateStatusByChannelId(channelId, status);
        console.log(`${host} is ${ipStatus ? 'alive' : 'dead'}. Status updated: ${updated}`);
    });
  
    await Promise.all(pingPromises);
};
  
pingIpsAndUpdateStatus();
  
const findChannelIdByIp = async (ip: string): Promise<number | undefined> => {
    const pingerInstance = await Pinger.findOne({ where: { value: ip } }) as PingerInstance;
    if (!pingerInstance) {
        return undefined;
    }
    return pingerInstance.channel_id;
};


export {
    Pinger,
    addNewIp,
    findIpsByChannelId,
    updateIpByPingerId,
    deleteIpByPingerId,
    findAllIps,
    findIPsForActiveChannels,
    ping
};
