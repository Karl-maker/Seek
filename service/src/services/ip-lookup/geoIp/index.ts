import IIpLookup, { IGetLocationIpLookUp } from "..";
import geoip from "geoip-lite";
import { getCountryNameFromCode } from "../../../utils/location";

export default class GeoIpLite implements IIpLookup {
    constructor() {}
    getLocation(ip: string): IGetLocationIpLookUp {
        const geo = geoip.lookup(ip);
        return {
            area: geo.city,
            country: getCountryNameFromCode(geo.country),
            state: geo.region || "",
            coordinates: {
                longitude: geo.ll[0],
                latitude: geo.ll[1]
            }
        }
    }
}