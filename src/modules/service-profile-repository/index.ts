import IBaseRepository, { IBase, IFindManyOptions, IFindManyResponse } from "../base-repository";

export interface IServiceProfileRepository extends IBaseRepository<IServiceProfile> {
    findManyByArea(location: { 
        country: string, 
        area: string,
        state?: string,
    }, options?: IFindManyOptions<IServiceProfile>): Promise<IFindManyResponse<IServiceProfile>>
} 

export interface IServiceProfile extends IBase {
    profession: string;
    first_name: string;
    last_name: string;
    picture?: string;
    verified: boolean;
    account_id?: string; 
    location?: {
        country: string;
        state?: string;
        areas: string[];
    }
}
