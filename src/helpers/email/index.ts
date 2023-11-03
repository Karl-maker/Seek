export default interface IEmail {
    send(input: IEmailInput)
}

export enum templates {
    Information = "information",
    ConfirmationCode = "confirmation-code",
    ConfirmationLink = "confirmation-link"
}

export interface IEmailInput {
    subject: string, 
    to: string, 
    template: templates,
    context: IInformationContext | IConfirmationCodeContext | IConfirmationLinkContext
}

export interface IInformationContext {
    name: string;
    message: string;
    header: string;
}

export interface IConfirmationCodeContext extends IInformationContext {
    code: string;
}

export interface IConfirmationLinkContext extends IInformationContext {
    url: string;
}