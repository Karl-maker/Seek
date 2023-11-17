import IBaseRepository, { IBase } from "../base-repository";

export interface IServiceRepository extends IBaseRepository<IService> {

} 

export interface IService extends IBase {
    service_profile_id: string;
    name: string;
    description: string;
    cost: {
        unit: 'hour' | 'flat' | 'sqft' | 'm²' | 'installation' | 'room' | 'unit' | 'item' | 'month' | 'day';
        amount: number;
        currency: 'TTD' | 'JMD';
    }
}