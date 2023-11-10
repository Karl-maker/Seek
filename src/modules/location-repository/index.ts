import IBaseRepository, { IBase } from "../base-repository";

export default interface ILocationsRepository extends IBaseRepository<ILocation> {

}

export interface ILocation extends IBase {
    area: string;
    country: string;
    state?: string; // Optional, as not all countries have states 
}

