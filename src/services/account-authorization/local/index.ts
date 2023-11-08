import IAccountAuthorization, { IAuthorizePayload } from "..";
import { ITokenManager } from "../../../helpers/token";
import HTTPError from "../../../utils/error";

export default class LocalAccountAuthorization implements IAccountAuthorization {
    accessTokenManager: ITokenManager<IAuthorizePayload>;
    constructor(accessTokenManager: ITokenManager<IAuthorizePayload>){
        this.accessTokenManager = accessTokenManager
    }

    async authorize(access_token: string): Promise<IAuthorizePayload> {
        const payload = this.accessTokenManager.verifyToken(access_token);

        if (!payload) {
            throw new HTTPError(`Access token is invalid or expired`, 401);
        }

        return payload;
    }
}