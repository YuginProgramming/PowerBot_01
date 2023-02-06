import { Model, DataTypes } from 'sequelize';
import { StatusEnum } from '../config/enum';
import { sequelize } from './sequelize';
import { logger } from '../logger';

class Status extends Model {}
Status.init({
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM(...Object.values(StatusEnum)),
        allowNull: false
    }
}, {
    freezeTableName: false,
    timestamps: true,
    modelName: 'statuses',
    sequelize
});

interface StatusFields {
    id: number,
    channel_id: number,
    status: StatusEnum,
    createdAt: Date,
    updatedAt: Date,
}

const createStatus = async (channelId: number, status: StatusEnum): Promise<StatusFields|undefined> => {
    let res;
    try {
        res = await Status.create({ channel_id: channelId, status });
        res = res.dataValues;
        logger.info(`Created status with id: ${res.id}`);
    } catch (err) {
        logger.error(`Impossible to create status: ${err}`);
    }
    
    return res;
};

const findStatusById = async (id: number): Promise<StatusFields|null> => {
    const res = await Status.findOne({ where: { id: id } });
    if (res) return res.dataValues;
    return res;
};

interface FindAllTypes { 
    channel_id?: number, 
    status?: StatusEnum 
}

const findAllStatuses = async (params: FindAllTypes): Promise<Array<StatusFields>|undefined> => {
    const res = await Status.findAll({ 
        where: { ...params }
    });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

const updateStatusByChannelId = async (channelId: number, status: StatusEnum): Promise<boolean> => {
    const res = await Status.update({ status }, { where: { channel_id: channelId } });
    if (res[0]) logger.info(`Status updated: ${res}`);
    return res[0] ? true : false;
};

const deleteStatusById = async (id: number): Promise<boolean> => {
    const res = await Status.destroy({ where: { id } });
    if (res) logger.info(`Deleted status: ${res}`);
    return res ? true : false;
};

export {
    Status,
    createStatus,
    findStatusById,
    findAllStatuses,
    updateStatusByChannelId,
    deleteStatusById
};