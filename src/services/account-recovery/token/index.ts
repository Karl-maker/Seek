import IAccountPasswordRecovery, { IPasswordRecovery } from "..";
import { IAccountRepository } from "../../../modules/account-repository";
import NodeMailer from "../../../helpers/email/nodemailer";
import TwilioSMS from "../../../helpers/sms/twilio";
import CommunicationViaSMS, { ISMSInput } from "../../communication/sms";
import CommunicationViaEmail from "../../communication/email";
import { IEmailInput, templates } from "../../../helpers/email";
import { config as CONFIG } from "../../../config";
import { ITokenManager } from "../../../helpers/token";

const twilio = new TwilioSMS();
const nodemailer = new NodeMailer();

export interface IPasswordRecoveryToken {
    sub: string;
}

export default class AccountPasswordRecoveryWithToken implements IAccountPasswordRecovery {
    accountRepository: IAccountRepository;
    resetPasswordToken: ITokenManager<IPasswordRecoveryToken>;

    constructor(accountRepository: IAccountRepository, resetPasswordToken: ITokenManager<IPasswordRecoveryToken>) {
        this.accountRepository = accountRepository;
        this.resetPasswordToken = resetPasswordToken;
    }

    async sendRecoveryDetails(input: IPasswordRecovery): Promise<void> {

        const account = await this.accountRepository.findOne({
            ...input
        });

        const token = await this.resetPasswordToken.createToken({
            sub: account._id
        });

        const url = `${CONFIG.client.url}/recover-password?token=${token}`;

        if(account['email']) {
            const config: IEmailInput = {
                subject: "Recover Password",
                to: account['email'],
                template: templates.PasswordRecovery,
                context: {
                    url,
                    name: account.first_name,
                    message: 'Reset your password with the link below',
                    header: 'Password Recovery'
                }
            }
            await new CommunicationViaEmail(nodemailer).send(config);
        } else if (account['mobile']) {
            const config: ISMSInput = {
                message: `Reset your password with link: ${url}`,
                to: account["mobile"]
            }
            await new CommunicationViaSMS(twilio).send(config);
        }
    }
}