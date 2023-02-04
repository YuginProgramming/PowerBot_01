import { Model, DataTypes, Op } from 'sequelize';
import { sequelize } from './sequelize';
import { LogLevelsEnum } from '../config/enum';

class Log extends Model {}
Log.init({
    channel_id: {
        type: DataTypes.INTEGER
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: false,
    timestamps: true,
    modelName: 'logs',
    updatedAt: false,
    sequelize
});

interface LogFields {
    id: number,
    channel_id: number,
    level: LogLevelsEnum,
    createdAt: Date
}

const findLogsByLevel = async (level: LogLevelsEnum): Promise<Array<LogFields>|undefined> => {
    const res = await Log.findAll({ where: { level } });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

const findLogsByDates = async (startDate: Date, endDate: Date): Promise<Array<LogFields>|undefined> => {
    const res = await Log.findAll({ where: { createdAt : { [Op.between] : [startDate, endDate] } } });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

export {
    Log,
    LogFields,
    findLogsByLevel,
    findLogsByDates
};