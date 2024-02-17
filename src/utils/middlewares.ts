import {NextFunction, Request, Response} from 'express';
import {error} from "./responses";

export const _404 = (req: Request, res: Response) => {
    return error(res, "Route not found", 404);
}

export const _500 = (err: any, req: Request, res: Response, next: NextFunction) => {
    return error(res, err.message, err.status || 500, err.stack);
}

