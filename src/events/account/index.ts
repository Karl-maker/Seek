import { IAccount } from "../../modules/account-repository" 

export const AccountTopics = {
    SIGNUP: 'ACCOUNT_SIGNUP',
    LOGIN: 'ACCOUNT_LOGIN'
}

export interface IAccountSignupPayload {
    account: Partial<IAccount>;
}

export interface IAccountLoginPayload {
    account: Partial<IAccount>;
}