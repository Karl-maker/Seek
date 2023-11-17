import { Request } from 'express';

export default interface IRetrieveRefreshToken {
    retrieve(req: Request): string;
}