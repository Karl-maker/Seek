import IAccountPasswordRecovery from "..";
import { IAccountRepository } from "../../../modules/account-repository";

export default class AccountPasswordRecoveryWithPIN implements IAccountPasswordRecovery {
    accountRepository: IAccountRepository;

    constructor(accountRepository: IAccountRepository) {
        this.accountRepository = accountRepository;
    }

    async sendRecoveryDetails(account_id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}