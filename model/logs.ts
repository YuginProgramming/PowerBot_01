import { Model, DataTypes, Op } from 'sequelize';
import { sequelize } from './sequelize';
import { LogLevelsEnum } from '../config/enum';

class Log extends Model {}
Log.init({
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false
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

// 🏂🌠🚩🗽✨🎈🌞⛵🎃🎏🚸
// const now = DateTime.now().toFormat('yy-MM-dd HH:mm:ss.SSS');
// console.log(`✨ ${now} [${level}]: ${description}`);

const createNewLog = async (channelId: number, description: string, level: LogLevelsEnum): Promise<LogFields|undefined> => {
    let res;
    try {
        res = await Log.create({ channel_id: channelId, description, level });
    } catch (err) {
        // console.log(err)
    }
    if (res) {

        return res.dataValues;
    }
    return;
};

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

// createNewLog(3, 'ddddd', LogLevelsEnum.warn);
// findLogsByLevel(LogLevelsEnum.warn)
// findLogsByDates(new Date('2023-01-01'), new Date('2023-01-31'));

export {
    Log,
    createNewLog,
    findLogsByLevel,
    findLogsByDates
};