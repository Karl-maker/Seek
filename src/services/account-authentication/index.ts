import { IAccountRepository } from "../../modules/account-repository";

export default interface IAccountAuthentication {
    accountRepository: IAccountRepository;
    login(credentials: ICredentials): Promise<ILoginResponse>;
    authorize(access_token: string): Promise<IAuthorizePayload>;
    logout(account_id: string): Promise<ILogoutResponse>;
}

export interface IAuthorizePayload {
    sub: string | number;
    role: "admin" | "user";
}

export interface IRefreshPayload {
    access_token: string;
}

export interface ILoginResponse {
    access_token: string;
    refresh_token?: string;
}

export interface ILogoutResponse {
    success: boolean;
}

export interface ICredentials {
    password: string;
    email?: string;
    mobile?: string;
}