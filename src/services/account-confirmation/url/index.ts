import IAccountConfirmation, { IGenerateResponse, ICheckResponse } from "..";
import { IAccountConfirmationRepository } from "../../../modules/account-confirmation-repository";
import { IAccount, IAccountRepository } from "../../../modules/account-repository";

export default class AccountConfirmationWithURL implements IAccountConfirmation {
    accountRepository: IAccountRepository;
    accountConfirmationRepository: IAccountConfirmationRepository;

    constructor(accountRepository: IAccountRepository) {
        this.accountRepository = accountRepository
    }
    generate(account:  Partial<IAccount>): Promise<IGenerateResponse> {
        throw new Error("Method not implemented.");
    }

    check(account_id: string, confirmation: string): Promise<ICheckResponse> {
        throw new Error("Method not implemented.");
    }

}