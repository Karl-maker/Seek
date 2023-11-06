import { IAccount, IAccountRepository } from "../../modules/account-repository";

export default interface IAccountAuthentication {
    accountRepository: IAccountRepository;
    login(credentials: ICredentials): Promise<ILoginResponse>;
    authorize(access_token: string): Promise<IAuthorizePayload>;
    refresh(cred: string): Promise<IRefreshPayload>;
    logout(cred: string): Promise<ILogoutResponse>;
    signup(data: IAccount): Promise<ISignupResponse>;
}

export interface IAuthorizePayload {
    sub: string | number;
    role: "admin" | "user";
}

export interface IRefreshPayload {
    access_token?: string;
}

export interface IRefreshTokenPayload {
    sub: string | number;
    session: {
        id: string
    };
}

export interface ILoginResponse {
    access_token: string;
    refresh_token?: string;
    account: Partial<IAccount>;
}

export interface ILogoutResponse {
    success: boolean;
    account: Partial<IAccount>;
}

export interface ICredentials {
    password: string;
    email?: string;
    mobile?: string;
}

export interface ISignupResponse {
    success: boolean;
    account: Partial<IAccount>
}