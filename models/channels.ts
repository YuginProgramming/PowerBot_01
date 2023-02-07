import { Model, DataTypes } from "sequelize";
import { sequelize } from './sequelize';
import { logger } from '../logger';

// const sequelize = new Sequelize({
//     storage: __dirname + '/pb.db',
//     dialect: 'sqlite'
// });

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
    },
    pinger_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: false,
    timestamps: false,
    modelName: 'channels',
    sequelize
});

const addNewChannel = async (channelData: ChannelData): Promise<ChannelValues|undefined> => {
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
    id: number,
    pinger_id?: number,
    shortname?: string,
    longname?: string,
    tg_id?: string,
    active?: boolean,
}

const updateChannelById = async (updateParams: UpdateParams): Promise<boolean> => {
    const res = await Channel.update({ ...updateParams } , { where: { id: updateParams.id } });
    if (res[0]) logger.info(`Channel updated: ${res}`);
    return res[0] ? true : false;
};

const deleteChannelById = async (id: number): Promise<boolean> => {
    const res = await Channel.update({ active: false }, { where: { id: id } });
    if (res) logger.info(`Deleted channel: ${id}`);
    return res[0] ? true : false;
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
    addNewChannel,
    deleteChannelById,
    findChannelsByPingerId,
    findChannelById,
    updateChannelById,
    findChannelsByStatus
};