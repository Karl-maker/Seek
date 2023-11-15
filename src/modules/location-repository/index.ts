import IBaseRepository, { IBase } from "../base-repository";

export default interface ILocationRepository extends IBaseRepository<ILocation> {

}

export interface ILocation extends IBase {
    area: string;
    country: string;
    state?: string; // Optional, as not all countries have states 
}

