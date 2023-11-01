import { IAccountRepository } from "../../modules/account-repository";

export default interface IAccountPasswordRecovery {
    accountRepository: IAccountRepository;
    sendRecoveryDetails(account_id: string): Promise<void>;
}