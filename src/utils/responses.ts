import {Response} from 'express';

export const success = (res: Response, message: string, data: any = null, statusCode: number = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}

export const error = (res: Response, message: string, statusCode: number = 400, stack = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errorStack: process.env.NODE_ENV === "development" ? stack : null
    });
}

