import IBaseRepository, { IBase } from "../base-repository";

export interface ILoginRepository extends IBaseRepository<ILogin> {

}

export interface ILogin extends IBase {
    account_id: string | number;
    method: "jwt" | "facebook";
    medium?: string;
    ip_address?: string;
    location?: string;
    device?: string;
}