import { Model, DataTypes } from "sequelize";
import { sequelize } from './sequelize';
import { logger } from '../logger';

interface ChannelData {
    shortname: string,
    longname?: string,
    tg_id: string,
    pinger_id: number,
}

interface ChannelValues extends ChannelData {
    id: number,
    longname: string,
    active: boolean,
}

class Channel extends Model {}
Channel.init({
    shortname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    longname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    tg_id: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: false,
    timestamps: false,
    modelName: 'channels',
    sequelize
});

const createNewChannel = async (channelData: ChannelData): Promise<ChannelValues|undefined> => {
    let res;
    try {
        res = await Channel.create({ ...channelData });
        res = res.dataValues;
        logger.info(`Created channel with id: ${res.id}`);
    } catch (err) {
        logger.error(`Impossible to create channel: ${err}`);
    }
    return res;
};

interface UpdateParams {
    pinger_id?: number,
    shortname?: string,
    longname?: string,
    tg_id?: string,
    active?: boolean,
}

const updateChannelById = async (id: number, updateParams: UpdateParams): Promise<ChannelValues|undefined> => {
    const res = await Channel.update({ ...updateParams } , { where: { id } });
    if (res[0]) {
        const data = await findChannelById(id);
        if (data) {
            logger.info(`Channel ${data.id} updated`);
            return data;
        }
        logger.info(`Channel ${id} updated, but can't read result data`);
    } 
    return undefined;
};

const channelDeactivate = async (id: number): Promise<number|undefined> => {
    const res = await Channel.update({ active: false }, { where: { id } });
    if (res) logger.info(`Channel ${id} deactivated`);
    return res[0] ? id : undefined;
};

const findChannelsByPingerId = async (pinger_id: number): Promise<Array<ChannelValues>|undefined> => {
    const res = await Channel.findAll({ where: { pinger_id: pinger_id } });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

const findChannelsByStatus = async (active: boolean): Promise<Array<ChannelValues>|undefined> => {
    const res = await Channel.findAll({ where: { active } });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

const findChannelById = async (id: number): Promise<ChannelValues|null> => {
    const res = await Channel.findOne({ where: { id: id } });
    if (res) return res.dataValues;
    return res;
};

export {
    Channel,
    ChannelData,
    createNewChannel,
    channelDeactivate,
    findChannelsByPingerId,
    findChannelById,
    updateChannelById,
    findChannelsByStatus
};   