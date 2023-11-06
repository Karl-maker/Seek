import ICommunication from "..";
import IEmail, { IEmailInput } from "../../../helpers/email";

export default class CommunicationViaEmail implements ICommunication<IEmailInput> {

    emailSender: IEmail;

    constructor(emailSender: IEmail){
        this.emailSender = emailSender;
    }

    async send(input: IEmailInput): Promise<void> {
        await this.emailSender.send(input);
    }

}