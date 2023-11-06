import { IAccount } from "../../modules/account-repository" 

export const AccountTopics = {
    SIGNUP: 'ACCOUNT_SIGNUP',
    LOGIN: 'ACCOUNT_LOGIN',
    LOGOUT: 'ACCOUNT_LOGOUT',
    DELETE: 'ACCOUNT_DELETE',
    DEACTIVATE: 'ACCOUNT_DEACTIVATE',
    PASSWORD_RESET: 'ACCOUNT_PASSWORD_RESET'
}

export interface IAccountSignupPayload {
    account: Partial<IAccount>;
}

export interface IAccountLoginPayload {
    account: Partial<IAccount>;
}

export interface IAccountLogoutPayload {
    account: Partial<IAccount>;
}

export interface IAccountDeletedPayload {
    account: Partial<IAccount>;
}

export interface IAccountDeactivatePayload {
    account: Partial<IAccount>;
    reason: string;
}

export interface IAccountResetPasswordPayload {
    account: Partial<IAccount>;
}