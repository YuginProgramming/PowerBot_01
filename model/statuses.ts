import { Sequelize, Model, DataTypes } from 'sequelize';
import { StatusEnum } from '../config/enum';

const sequelize = new Sequelize({
    storage: __dirname + '/pb.db',
    dialect: 'sqlite'
});

class Status extends Model {}
Status.init({
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM(StatusEnum.on, StatusEnum.off),
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
    } catch (err) {
        //
    }
    const json = res?.toJSON();
    return json;
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
    return res[0] ? true : false;
};

const deleteStatusById = async (id: number): Promise<boolean> => {
    const res = await Status.destroy({ where: { id } });
    return res ? true : false;
};

createStatus(128, StatusEnum.on);
findStatusById(3);
findAllStatuses({ channel_id: 4 });
updateStatusByChannelId(4, StatusEnum.on);
deleteStatusById(1);

export {
    Status,
    createStatus,
    findStatusById,
    findAllStatuses,
    updateStatusByChannelId,
    deleteStatusById
};