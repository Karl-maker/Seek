import IRetrieveRefreshToken from "..";
import { Request } from 'express';

export default class RetrieveRefreshTokenFromWeb implements IRetrieveRefreshToken {
    retrieve(req: Request): string {
        if(req['cookies'] ) {
            return req['cookies'].refresh_token || '';
        }
        return "";
    }
    
}