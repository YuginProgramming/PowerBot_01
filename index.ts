// Load priority:
// db 

// pinger

// router-server




import config from './config';
import express, { Express, Request, Response } from 'express';
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });

// dotenv.config();

const app: Express = express();
const port = process.env.PORT || config.express.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});