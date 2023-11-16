import {
    Response,
    Request,
    NextFunction
} from 'express';
import { getAccessTokenFromHeader } from "../../utils/bearer-token";
import HTTPError from "../../utils/error";
import IAccountAuthorization from "../../services/account-authorization";
import { logger } from '../../helpers/logger/basic-logging';

export const authenticate = (accountAuth: IAccountAuthorization, role: 'admin' | 'any' = 'any') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            logger.debug('Enter authenticate method');
            const authInfo = await accountAuth.authorize(getAccessTokenFromHeader(req));
            req['user'] = {
                id: authInfo.sub,
                role: authInfo.role
            };

            if(role === 'any') {
                logger.debug('Exit authenticate method');
                next();
            } 
            if(role === 'admin' && authInfo.role !== 'admin') throw new HTTPError(`Forbidden`, 403);
            logger.debug('Exit authenticate method');
            next();

        } catch(err) {
            next(err)
        }
    } 
}

export const guard = (callback: (user: { id: string }) => Promise<boolean>) => {
    return async (req: Request, res: Response, next: NextFunction) => { 
        try{
            const user = req['user'];
            const isAllowed = await callback(user);
            if(!isAllowed) throw new HTTPError(`Forbidden`, 403);
            next();
        } catch(err) {
            next(err);
        }
    }
}