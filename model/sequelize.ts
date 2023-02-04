import { Sequelize } from 'sequelize';

const dbpath = __dirname + '/pb.db';

export const sequelize = new Sequelize({
    storage: dbpath,
    dialect: 'sqlite',
    logging: false
});
