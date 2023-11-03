import { IAccountRepository } from "../../modules/account-repository";

export default interface IAccountConfirmation {
    accountRepository: IAccountRepository;
    generate(account_id: string): Promise<IGenerateResponse>;
    check(confirmation: string): Promise<ICheckResponse>;
}

export interface IGenerateResponse {
    success: boolean;
    token: string;
}

export interface ICheckResponse {
    confirmed: boolean;
}