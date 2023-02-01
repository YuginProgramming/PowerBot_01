import express, { Router, Request, Response } from 'express';
export const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

export const routes = express.Router();
routes.use(router);


