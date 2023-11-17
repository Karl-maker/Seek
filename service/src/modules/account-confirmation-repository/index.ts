import IBaseRepository, { IBase } from "../base-repository";

export interface IAccountConfirmationRepository extends IBaseRepository<IAccountConfirmation> {
    
}

export interface IAccountConfirmation extends IBase {
    method: 'sms' | 'email';
    account_id: string;
    code: string;
}
