import { IAccount } from "../../modules/account-repository" 

export const AccountTopics = {
    SIGNUP: 'ACCOUNT_SIGNUP'
}

export interface IAccountSignupPayload {
    account: Partial<IAccount>;
}