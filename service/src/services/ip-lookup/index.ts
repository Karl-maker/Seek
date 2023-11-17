export default interface IIpLookup {
    getLocation(ip: string): IGetLocationIpLookUp
}

export interface IGetLocationIpLookUp {
    area: string;
    country: string;
    state?: string;
    coordinates: {
        longitude: number;
        latitude: number;
    }
}