import 'dotenv/config';
import * as config from './config';
import * as express from 'express';
import { routes } from './src/router';
import { logger } from './logger';

// Load priority:
// DB

// pinger

// crawler

// express app
const app = express();
const expressPort = process.env.PORT || config.express.PORT;

app.use('/', routes);

app.listen(expressPort, () => {
    logger.info(`Server started at http://localhost:${expressPort}`);
});

