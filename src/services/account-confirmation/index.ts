import IEmail, { IEmailInput } from "../../helpers/email";
import ISMS from "../../helpers/sms";
import { IAccountConfirmationRepository } from "../../modules/account-confirmation-repository";
import { IAccount, IAccountRepository } from "../../modules/account-repository";

export default interface IAccountConfirmation {
    sms: ISMS;
    email: IEmail;
    accountRepository: IAccountRepository;
    accountConfirmationRepository: IAccountConfirmationRepository;
    generate(account: Partial<IAccount>): Promise<IGenerateResponse>;
    check(account_id: string, confirmation: string): Promise<ICheckResponse>;
}

export interface IGenerateResponse {
    success: boolean;
    token: string;
}

export interface ICheckResponse {
    confirmed: boolean;
}