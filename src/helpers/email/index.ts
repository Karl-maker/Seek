export default interface IEmail {
    send(
        subject: string, 
        to: string, 
        template: templates,
        context: IInformationContext | IConfirmationCodeContext | IConfirmationLinkContext
        )
}

export enum templates {
    Information = "information",
    ConfirmationCode = "confirmation-code",
    ConfirmationLink = "confirmation-link"
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