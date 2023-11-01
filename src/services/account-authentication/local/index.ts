import IAccountAuthentication, { ICredentials, ILoginResponse, ILogoutResponse } from "..";
import { IAccountRepository } from "../../../modules/account-repository";

export default class LocalAccountAuthentication implements IAccountAuthentication {
    accountRepository: IAccountRepository;

    constructor(accountRepository: IAccountRepository) {
        this.accountRepository = accountRepository;
    }

    login(credentials: ICredentials): Promise<ILoginResponse> {
        throw new Error("Method not implemented.");
    }
    logout(account_id: string): Promise<ILogoutResponse> {
        throw new Error("Method not implemented.");
    }
}