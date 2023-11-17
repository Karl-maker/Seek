import { config } from "../../config";
import { IMongoDB } from "../../helpers/database/mongo";
import IMessengerQueue from "../../helpers/event";
import IServer from "../../helpers/server";
import JWTService from "../../helpers/token/jwt";
import { authenticate } from "../../middlewares/authorize";
import IServiceProfileAvailabilityRepository from "../../modules/service-profile-availability-repository";
import { MongoServiceProfileAvailabilityRepository } from "../../modules/service-profile-availability-repository/mongo";
import IAccountAuthorization, { IAuthorizePayload } from "../../services/account-authorization";
import LocalAccountAuthorization from "../../services/account-authorization/local";
import ServiceController from "./controller";

const ROUTE = '/service-profile-availability';
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
    const serviceController = new ServiceController(event);
    const serviceProfileAvailabilityRepository: IServiceProfileAvailabilityRepository = new MongoServiceProfileAvailabilityRepository(db);
    const localJWTAuthorization: IAccountAuthorization = new LocalAccountAuthorization(accessTokenManager)

    server.router.post(`${ROUTE}`, authenticate(localJWTAuthorization), serviceController.createAvailability(serviceProfileAvailabilityRepository));
    server.router.delete(`${ROUTE}/:service_profile_availability_id`, authenticate(localJWTAuthorization), serviceController.deleteAvailability(serviceProfileAvailabilityRepository));
} 