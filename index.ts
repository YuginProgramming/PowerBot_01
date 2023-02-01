import {  } from './config';
import express, { Express } from 'express';
import 'dotenv/config';
import { routes } from './src/router';

// Load priority:
// DB

// pinger

// crawler

// express app
const app: Express = express();
const expressPort = process.env.PORT || config.express.PORT;

app.use('/', routes);

app.listen(expressPort, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${expressPort}`);
});

