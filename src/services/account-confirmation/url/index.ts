import IAccountConfirmation, { IGenerateResponse, ICheckResponse } from "..";
import { IAccountRepository } from "../../../modules/account-repository";

export default class AccountConfirmationWithURL implements IAccountConfirmation {
    accountRepository: IAccountRepository;
    
    constructor(accountRepository: IAccountRepository) {
        this.accountRepository = accountRepository
    }
    generate(account_id: string): Promise<IGenerateResponse> {
        throw new Error("Method not implemented.");
    }
    check(confirmation: string): Promise<ICheckResponse> {
        throw new Error("Method not implemented.");
    }

}