import { config } from "../../config";
import { IMongoDB } from "../../helpers/database/mongo";
import IMessengerQueue from "../../helpers/event";
import IServer from "../../helpers/server";
import JWTService from "../../helpers/token/jwt";
import { authenticate } from "../../middlewares/authorize";
import { IRatingServiceProfileRepository } from "../../modules/rating-service-profile-repository";
import { MongoRatingServiceProfileRepository } from "../../modules/rating-service-profile-repository/mongo";
import IAccountAuthorization, { IAuthorizePayload } from "../../services/account-authorization";
import LocalAccountAuthorization from "../../services/account-authorization/local";
import RatingServiceProfileController from "./controller";

const ROUTE = '/rating-service-profile';
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
    const ratingServiceProfileController = new RatingServiceProfileController(event);
    const ratingServiceProfileRepository: IRatingServiceProfileRepository = new MongoRatingServiceProfileRepository(db);
    const localJWTAuthorization: IAccountAuthorization = new LocalAccountAuthorization(accessTokenManager);

    server.router.post(`${ROUTE}`, authenticate(localJWTAuthorization), ratingServiceProfileController.addRatingToServiceProfile(ratingServiceProfileRepository));
    server.router.post(`${ROUTE}/:rating_service_profile_id`, authenticate(localJWTAuthorization), ratingServiceProfileController.removeRatingToServiceProfile(ratingServiceProfileRepository));
} 