import { StatusEnum } from '../config/enum';
import { Status, createStatus } from '../model/statuses';

Status.sync();
createStatus(55, StatusEnum.off);

// class Pinger extends Model {}
// Pinger.init({
//     type: {
//         type: DataTypes.ENUM('ip_pinger'),
//         allowNull: false
//     },
//     channel_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     value: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }, {
//     freezeTableName: false,
//     timestamps: false,
//     modelName: 'pingers',
//     sequelize
// }
// );
// Pinger.sync();

// class Channel extends Model {}
// Channel.init({
//     shortname: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     longname: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     active: {
//         type: DataTypes.BOOLEAN,
//         allowNull: false
//     },
//     tg_id: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     pinger_id: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     }
// }, {
//     freezeTableName: false,
//     timestamps: false,
//     modelName: 'channels',
//     sequelize
// }
// );
// Channel.sync();

// class Log extends Model {}
// Log.init({
//     channel_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     description: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     level: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }, {
//     freezeTableName: false,
//     timestamps: true,
//     modelName: 'logs',
//     sequelize
// }
// );
// Log.sync();