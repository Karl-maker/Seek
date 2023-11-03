import ICommunication from "..";
import ISMS from "../../../helpers/sms";

export default class CommunicationViaSMS implements ICommunication<ISMSInput> {

    smsSender: ISMS;

    constructor(smsSender: ISMS){
        this.smsSender = smsSender;
    }

    async send(input: ISMSInput): Promise<void> {
        this.smsSender.send(input.to, input.message);
    }

}

export  interface ISMSInput {
    message: string,
    to: string
}