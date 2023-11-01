import { IAccountRepository } from "../../modules/account-repository";

export default interface IAccountAuthentication {
    accountRepository: IAccountRepository;
    login(credentials: ICredentials): Promise<ILoginResponse>;
    logout(account_id: string): Promise<ILogoutResponse>;
}

export interface ILoginResponse {
    access_token: string;
}

export interface ILogoutResponse {
    success: boolean;
}

export interface ICredentials {
    password?: string;
    email?: string;
    mobile?: string;
}