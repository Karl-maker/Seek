import IBaseRepository, { IBase } from "../base-repository";

export interface IAccountRepository extends IBaseRepository<IAccount> {

}

export interface IAccount extends IBase {
    email?: string;
    mobile?: string;
    password: string;
}