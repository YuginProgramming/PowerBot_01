import 'dotenv/config';
// import * as express from 'express';
import * as config from './config';
// import { routes } from './src/router';
import { logger } from './logger';
import { sequelize } from './models/sequelize';
import { pingerSetIntervalId } from './src/pinger';

const main = async () => {
    // DB
    const configTables = config.models.list;
    const dbInterface = sequelize.getQueryInterface();
    const checks = await Promise.all(configTables.map(configTable => {
        return dbInterface.tableExists(configTable);
    }));
    const result = checks.every(el => el === true);
    if (!result) {
        // eslint-disable-next-line no-console
        console.error(`🚩 Failed to check DB tables, see config.models.list`);
        throw (`Some DB tables are missing`);
    }
    logger.info('DB connected.');

    // pinger
    logger.info(`Pinger SetIntervalId ${pingerSetIntervalId} is running`);
    
    // crawler
    
    // express app
    // const app = express();
    // const expressPort = process.env.PORT || config.express.PORT;
    
    // app.use('/', routes);
    
    // app.listen(expressPort, () => {
    //     logger.info(`Server running on port ${expressPort}`);
    // });
}; 

main();
