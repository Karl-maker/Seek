import { config } from "../../config";
import { IMongoDB } from "../../helpers/database/mongo";
import IMessengerQueue from "../../helpers/event";
import IServer from "../../helpers/server";
import JWTService from "../../helpers/token/jwt";
import { authenticate } from "../../middlewares/authorize";
import { IServiceProfileRepository } from "../../modules/service-profile-repository";
import { MongoServiceProfileRepository } from "../../modules/service-profile-repository/mongo";
import { IServiceRepository } from "../../modules/service-repository";
import { MongoServiceRepository } from "../../modules/service-repository/mongo";
import IAccountAuthorization, { IAuthorizePayload } from "../../services/account-authorization";
import LocalAccountAuthorization from "../../services/account-authorization/local";
import ServiceController from "./controller";

const ROUTE = '/service';
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
    const serviceProfileRepository: IServiceProfileRepository = new MongoServiceProfileRepository(db)
    const localJWTAuthorization: IAccountAuthorization = new LocalAccountAuthorization(accessTokenManager)
    const serviceRepository: IServiceRepository = new MongoServiceRepository(db);

    server.router.post(`${ROUTE}`, authenticate(localJWTAuthorization), serviceController.createService(serviceRepository, serviceProfileRepository));
    server.router.patch(`${ROUTE}/:service_id`, authenticate(localJWTAuthorization), serviceController.updateService(serviceRepository));
    server.router.get(`${ROUTE}/:services_id`, authenticate(localJWTAuthorization), serviceController.getServiceById(serviceRepository));
    server.router.delete(`${ROUTE}/:services_id`, authenticate(localJWTAuthorization), serviceController.deleteServiceById(serviceRepository));
} 