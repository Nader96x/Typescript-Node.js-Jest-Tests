import {NextFunction, Request, Response} from 'express';

export const asyncHandler = (async_fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    async_fn(req, res, next).catch(next);
}
