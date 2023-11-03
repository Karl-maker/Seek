import ICommunication from "..";
import IEmail, { IEmailInput } from "../../../helpers/email";

export default class CommunicationViaEmail implements ICommunication<IEmailInput> {

    emailSender: IEmail;

    constructor(emailSender: IEmail){
        this.emailSender = emailSender;
    }

    send(input: IEmailInput): Promise<void> {
        throw new Error("Method not implemented.");
    }

}