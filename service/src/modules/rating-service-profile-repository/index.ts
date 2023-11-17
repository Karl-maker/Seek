import IBaseRepository, { IBase } from "../base-repository";

export interface IRatingServiceProfileRepository extends IBaseRepository<IRatingServiceProfile> {

} 

export interface IRatingServiceProfile extends IBase {
    service_profile_id: string;
    rated_by: {
        account_id: string;
    };
    rating: number; // 0 - 1
    comment: string;
}
