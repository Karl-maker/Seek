import { config } from "../../config";
import { IMongoDB } from "../../helpers/database/mongo";
import IMessengerQueue from "../../helpers/event";
import NodeServer from "../../helpers/server"
import JWTService from "../../helpers/token/jwt";
import { authenticate } from "../../middlewares/auth";
import { IAccountRepository } from "../../modules/account-repository";
import { MongoAccountRepository } from "../../modules/account-repository/mongo";
import { IServiceProfileRepository } from "../../modules/service-profile-repository";
import { MongoServiceProfileRepository } from "../../modules/service-profile-repository/mongo";
import IAccountAuthorization, { IAuthorizePayload } from "../../services/account-authorization";
import LocalAccountAuthorization from "../../services/account-authorization/local";
import ServiceProfileController from "./controller";

const ROUTE = '/service-profile';
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

export default (server: NodeServer, db: IMongoDB, event: IMessengerQueue) => {
    const serviceProfileController = new ServiceProfileController(event);
    const accountRepository: IAccountRepository = new MongoAccountRepository(db);
    const serviceProfileRepository: IServiceProfileRepository = new MongoServiceProfileRepository(db)
    const localJWTAuthorization: IAccountAuthorization = new LocalAccountAuthorization(accessTokenManager)

    server.app.post(`${ROUTE}/`, authenticate(localJWTAuthorization), serviceProfileController.createProfile(accountRepository, serviceProfileRepository));
}