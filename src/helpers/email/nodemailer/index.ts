import IEmail, { IConfirmationCodeContext, IConfirmationLinkContext, IInformationContext, templates } from "..";
import sendEmail from "./method";


export default class INodeMailer implements IEmail {

    async send(subject: string, to: string, template: templates, context: IInformationContext | IConfirmationCodeContext | IConfirmationLinkContext) {

        function enumToString(enumValue: any): string {
            const enumKey = Object.keys(templates).find(
                (key) => templates[key] === enumValue
            );
            return enumKey || 'Information'; // Return 'Unknown' if not found.
        }

        await sendEmail(
            to,
            subject,
            enumToString(template),
            context
        );
    }

}