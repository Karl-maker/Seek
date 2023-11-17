export default interface IEmail {
    send(input: IEmailInput)
}

export enum templates {
    Information = "information",
    ConfirmationCode = "confirmation-code",
    ConfirmationLink = "confirmation-link",
    PasswordRecovery = "password-recovery"
}

export interface IEmailInput {
    subject: string;
    to: string;
    template: templates;
    context: IInformationContext | IConfirmationCodeContext | IConfirmationLinkContext | IPasswordRecoveryContext;
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

export interface IPasswordRecoveryContext extends IInformationContext {
    url: string
}