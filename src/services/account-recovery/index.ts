import IEmail from "../../helpers/email";
import ISMS from "../../helpers/sms";
import { IAccountRepository } from "../../modules/account-repository";

export default interface IAccountPasswordRecovery {
    sms: ISMS;
    email: IEmail;
    accountRepository: IAccountRepository;
    sendRecoveryDetails(input: IPasswordRecovery): Promise<void>;
}

export interface IPasswordRecovery {
    mobile?: string,
    email?: string
}