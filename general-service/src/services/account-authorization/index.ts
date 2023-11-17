import { ITokenManager } from "../../helpers/token";

export default interface IAccountAuthorization {
    authorize(access_token: string): Promise<IAuthorizePayload>;
}

export interface IAuthorizePayload {
    sub: string | number;
    role: "admin" | "user";
}