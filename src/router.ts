import { Router, Request, Response } from 'express';
import * as express from 'express';
const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

export const routes = express.Router();
routes.use(router);


