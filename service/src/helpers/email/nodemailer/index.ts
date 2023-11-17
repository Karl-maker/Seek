import IEmail, { IEmailInput, templates } from "..";
import { logger } from "../../logger/basic-logging";
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
        logger.debug(`Enter send() method`)
        function enumToString(enumValue: any): string {
            const enumKey = Object.keys(templates).find(
                (key) => templates[key] === enumValue
            );
            return enumKey; // Return 'Unknown' if not found.
        }

        const {
            to,
            subject,
            template,
            context
        } = input;

        await sendEmail.call(
            this.config, 
            to,
            subject,
            templates[enumToString(template)],
            context
        );
    }

}