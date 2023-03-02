import { Model, DataTypes } from 'sequelize';
import { PingerTypeEnum } from '../config/enum';
import { sequelize } from './sequelize';
import { logger } from '../logger';

class Pinger extends Model {
    channel_id: any;
}
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

// const findIpsByChannelId = async (channel_id: number): Promise<PingerFields[]|undefined> => {
//     let res;
//     res = await Pinger.findAll({ 
//         where: { channel_id, type: PingerTypeEnum.ip } 
//     });
//     res = res.map(i => i.dataValues);
//     logger.info(`Found ${res.length} Values: ${res.map(i => i.value).join(', ')} IP(s) for channel_id: ${channel_id}`);
//     return res;
// };
const findIpsByChannelId = async (channel_ids: Array<number>): Promise<Array<PingerFields> | undefined> => {
    let res;
    res = await Pinger.findAll({ 
        where: { channel_id: channel_ids, type: PingerTypeEnum.ip } 
    });
    res = res.map(i => i.dataValues);
    logger.info(`Found ${res.length} Values: ${res.map(i => i.value).join(', ')} IP(s) for channel_ids: ${channel_ids}`);
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
    
// updateIpByPingerId(245, '192.168.1.26');


export {
    Pinger,
    PingerFields,
    addNewIp,
    findIpsByChannelId,
    updateIpByPingerId,
    deleteIpByPingerId
};
