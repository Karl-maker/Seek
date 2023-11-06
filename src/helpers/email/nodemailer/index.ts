import IEmail, { IConfirmationCodeContext, IConfirmationLinkContext, IEmailInput, IInformationContext, templates } from "..";
import sendEmail from "./method";

export interface INodeMailerConfig {
    service: string;
    host: string;
    port: number;
    auth: {
        user: string;
        pass: string;
    },
    secure: boolean;
}


export default class NodeMailer implements IEmail {

    config: INodeMailerConfig;
    
    constructor(config: INodeMailerConfig){
        this.config = config;
    }

    async send(input: IEmailInput) {

        function enumToString(enumValue: any): string {
            const enumKey = Object.keys(templates).find(
                (key) => templates[key] === enumValue
            );
            return enumKey || 'information'; // Return 'Unknown' if not found.
        }

        const {
            to,
            subject,
            template,
            context
        } = input;

        await sendEmail.call(
            this.config, 
            [
                to,
                subject,
                enumToString(template),
                context,    
            ]
        );
    }

}