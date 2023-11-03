import IBaseRepository, { IBase } from "../base-repository";

export interface ILoginRepository extends IBaseRepository<ILogin> {

}

export interface ILogin extends IBase {
    account_id: string | number;
    is_successful: boolean;
    refresh_token?: string;
    method: "jwt";
    ip_address: string;
    location: string;
    device: string;
}