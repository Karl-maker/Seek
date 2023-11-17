import { NextFunction, Request, Response } from 'express';
import HTTPError from '../../utils/error';
import { logger } from '../../helpers/logger/basic-logging';
import IServer from '../../helpers/server';
import IMessengerQueue from '../../helpers/event';

export default function errorHandler(server: IServer, event: IMessengerQueue){
    return (err: HTTPError | Error, req: Request, res: Response, next: NextFunction) => {
        switch (true) {
            case err instanceof HTTPError:
            // Handle HTTPError
            res.status((err as HTTPError).status || 500).json({
                error: {
                message: err.message,
                status: (err as HTTPError).status,
                },
            });
            break;
            default:
            // Handle other types of errors
            logger.error('Unexpected Issue', err); // Log the error for debugging purposes
            res.status(500).json({
                error: {
                message: 'Internal Server Error',
                status: 500,
                },
            });
            break;
        }
    }
}

export function error404(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({
        message: "Not Found"
    })
}
