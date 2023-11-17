import { config } from "../../config";
import { IMongoDB } from "../../helpers/database/mongo";
import IMessengerQueue from "../../helpers/event";
import IServer from "../../helpers/server";
import JWTService from "../../helpers/token/jwt";
import { authenticate } from "../../middlewares/authorize";
import ILocationsRepository from "../../modules/location-repository";
import { MongoLocationRepository } from "../../modules/location-repository/mongo";
import IAccountAuthorization, { IAuthorizePayload } from "../../services/account-authorization";
import LocalAccountAuthorization from "../../services/account-authorization/local";
import LocationController from "./controller";

const ROUTE = '/location';
const accessTokenManager = new JWTService<IAuthorizePayload>(
    {
        expiration: '30m',
        publicKey: config.token.access.public,
        privateKey: config.token.access.private,
        issuer: config.token.access.issuer,
    }
);

/**
 * @TODO add validation
 */

export default (server: IServer, db: IMongoDB, event: IMessengerQueue) => {
    const locationProfileController = new LocationController(event);
    const locationRepository: ILocationsRepository = new MongoLocationRepository(db);
    const localJWTAuthorization: IAccountAuthorization = new LocalAccountAuthorization(accessTokenManager);

    server.app.post(`${ROUTE}`, authenticate(localJWTAuthorization, 'admin'), locationProfileController.createLocation(locationRepository));
    server.app.patch(`${ROUTE}/:location_id`, authenticate(localJWTAuthorization, 'admin'), locationProfileController.updateLocationById(locationRepository));
    server.app.delete(`${ROUTE}/:location_id`, authenticate(localJWTAuthorization, 'admin'), locationProfileController.deleteLocationById(locationRepository));
    server.app.get(`${ROUTE}`, locationProfileController.getAllLocations(locationRepository));
} 