import {
    Response,
    Request,
    NextFunction
} from 'express';
import { getAccessTokenFromHeader } from "../../utils/bearer-token";
import HTTPError from "../../utils/error";
import IAccountAuthorization from "../../services/account-authorization";

export const authenticate = (accountAuth: IAccountAuthorization, role: 'admin' | 'any' = 'any') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            const authInfo = await accountAuth.authorize(getAccessTokenFromHeader(req));
            req['user'] = {
                id: authInfo.sub,
                role: authInfo.role
            };

            if(role === 'any') next();
            if(role === 'admin' && authInfo.role !== 'admin') throw new HTTPError(`Forbidden`, 403);

        } catch(err) {
            next(err)
        }
    } 
}