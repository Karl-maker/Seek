import IBaseRepository, { IBase } from "../base-repository";

export interface ILoginRepository extends IBaseRepository<ILogin> {
    findLastByAccountId: (account_id: string) => Promise<ILogin>;
}

export interface ILogin extends IBase {
    account_id: string | number;
    method: "jwt" | "facebook";
    medium?: string;
    ip_address?: string;
    location?: {
        area?: string;
        state?: string;
        country?: string;
        coordinates?: {
            longitude: number;
            latitude: number;
        }
    };
    device?: string;
    approved: boolean;
}