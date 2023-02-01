import { Sequelize, Model, DataTypes } from 'sequelize';
import { StatusEnum } from '../config/enum';

const sequelize = new Sequelize({
    storage: __dirname + '/pb.db',
    dialect: 'sqlite'
});

class Status extends Model { }
Status.init({
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM('on', 'off'),
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

const create = async (channelId: number, status: StatusEnum): Promise<StatusFields|undefined> => {
    let res;
    try {
        res = await Status.create({ channel_id: channelId, status });
    } catch (err) {
        //
    }
    const json = res?.toJSON();
    return json;
};

const findbyId = async (id?: number): Promise<StatusFields|null> => {
    const res = await Status.findOne({ where: { id: id } });
    if (res) return res.dataValues;
    return res;
};

const updateStatus = async (id: number, status: StatusEnum): Promise<boolean> => {
    const res = await Status.update({ status }, { where: { id: id } });
    return res[0] ? true : false;
};

const deletebyId = async (id: number): Promise<boolean> => {
    const res = await Status.destroy({ where: { id: id } });
    return res ? true : false;
};

// create(128, StatusEnum.on);
// findbyId(3)
updateStatus(126, StatusEnum.on);
// deletebyId(1)

export {
    Status,
    create,
    findbyId,
    updateStatus,
    deletebyId
};