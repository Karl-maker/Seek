import IBaseRepository, { IBase } from "../base-repository";

export interface IAccountRepository extends IBaseRepository<IAccount> {

}

export interface IAccount extends IBase {
    first_name: string;
    last_name: string;
    email?: string;
    mobile?: string;
    password: string;
    role: 'user' | 'admin';
    status: 'active' | 'deleted' | 'deactivated' | 'suspended';
}
