import IAccountConfirmation, { IGenerateResponse, ICheckResponse } from "..";
import { IEmailInput, templates } from "../../../helpers/email";
import NodeMailer from "../../../helpers/email/nodemailer";
import TwilioSMS from "../../../helpers/sms/twilio";
import { IAccountConfirmationRepository } from "../../../modules/account-confirmation-repository";
import { IAccount, IAccountRepository } from "../../../modules/account-repository";
import { generateRandomPin } from "../../../utils/pin";
import CommunicationViaSMS, { ISMSInput } from "../../communication/sms";
import CommunicationViaEmail from "../../communication/email";

const twilio = new TwilioSMS();
const nodemailer = new NodeMailer();

export default class AccountConfirmationWithPin implements IAccountConfirmation {
    accountRepository: IAccountRepository;
    accountConfirmationRepository: IAccountConfirmationRepository;

    constructor(accountRepository: IAccountRepository) {
        this.accountRepository = accountRepository
    }

    async generate(account: Partial<IAccount>): Promise<IGenerateResponse> {

        const code = generateRandomPin();
        await this.accountConfirmationRepository.create({
            account_id: account._id,
            code,
        });

        if(account['email']) {
            const config: IEmailInput = {
                subject: "Confirm Email",
                to: account['email'],
                template: templates.ConfirmationCode,
                context: {
                    code,
                    name: account.first_name,
                    message: 'Here is your confirmation code',
                    header: 'Confirmation Code'
                }
            }
            await new CommunicationViaEmail(nodemailer).send(config);
        } else if (account['mobile']) {
            const config: ISMSInput = {
                message: `Confirm your account with this code: ${code}`,
                to: account["mobile"]
            }
            await new CommunicationViaSMS(twilio).send(config);
        }

        return {
            success: true,
            token: code
        }
        
    }
    check(account_id: string, confirmation: string): Promise<ICheckResponse> {
        throw new Error("Method not implemented.");
    }

}