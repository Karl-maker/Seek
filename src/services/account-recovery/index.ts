import { IAccountRepository } from "../../modules/account-repository";

export default interface IAccountPasswordRecovery {
    accountRepository: IAccountRepository;
    sendRecoveryDetails(input: IPasswordRecovery): Promise<void>;
}

export interface IPasswordRecovery {
    mobile?: string,
    email?: string
}