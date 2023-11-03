import IEmail, { IConfirmationCodeContext, IConfirmationLinkContext, IEmailInput, IInformationContext, templates } from "..";
import sendEmail from "./method";


export default class NodeMailer implements IEmail {

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

        await sendEmail(
            to,
            subject,
            enumToString(template),
            context
        );
    }

}