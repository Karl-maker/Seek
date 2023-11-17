import IBaseRepository, { IBase } from "../base-repository";

export default interface IServiceProfileAvailabilityRepository extends IBaseRepository<IServiceProfileAvailability> {
    
} 

export interface IServiceProfileAvailability extends IBase {
    service_profile_id: string;
    free_slot: {
        start: Date;
        end: Date;
    },
    description: string;
}