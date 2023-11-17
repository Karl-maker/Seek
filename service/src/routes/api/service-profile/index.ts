import { config } from "../../../config";
import { IBucketStorage } from "../../../helpers/bucket";
import { FileSystemBucket } from "../../../helpers/bucket/file-system";
import { IMongoDB } from "../../../helpers/database/mongo";
import IMessengerQueue from "../../../helpers/event";
import IServer from "../../../helpers/server";
import JWTService from "../../../helpers/token/jwt";
import { authenticate } from "../../../middlewares/authorize";
import { IAccountRepository } from "../../../modules/account-repository";
import { MongoAccountRepository } from "../../../modules/account-repository/mongo";
import { IRatingServiceProfileRepository } from "../../../modules/rating-service-profile-repository";
import { MongoRatingServiceProfileRepository } from "../../../modules/rating-service-profile-repository/mongo";
import IServiceProfileAvailabilityRepository from "../../../modules/service-profile-availability-repository";
import { MongoServiceProfileAvailabilityRepository } from "../../../modules/service-profile-availability-repository/mongo";
import { IServiceProfileRepository } from "../../../modules/service-profile-repository";
import { MongoServiceProfileRepository } from "../../../modules/service-profile-repository/mongo";
import { IServiceRepository } from "../../../modules/service-repository";
import { MongoServiceRepository } from "../../../modules/service-repository/mongo";
import IAccountAuthorization, { IAuthorizePayload } from "../../../services/account-authorization";
import LocalAccountAuthorization from "../../../services/account-authorization/local";
import ServiceProfileController from "./controller";
import multer from 'multer';

const ROUTE = '/service-profile';
const bucketStorage: IBucketStorage = new FileSystemBucket();
const accessTokenManager = new JWTService<IAuthorizePayload>(
    {
        expiration: '30m',
        publicKey: config.token.access.public,
        privateKey: config.token.access.private,
        issuer: config.token.access.issuer,
    }
);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.storage.path)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = req['user'].id + Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  });
const upload = multer({ storage: storage })

/**
 * @TODO add validation
 */

export default (server: IServer, db: IMongoDB, event: IMessengerQueue) => {
    const serviceProfileController = new ServiceProfileController(event);
    const accountRepository: IAccountRepository = new MongoAccountRepository(db);
    const serviceProfileRepository: IServiceProfileRepository = new MongoServiceProfileRepository(db);
    const serviceProfileAvailabilityRepository: IServiceProfileAvailabilityRepository = new MongoServiceProfileAvailabilityRepository(db);
    const localJWTAuthorization: IAccountAuthorization = new LocalAccountAuthorization(accessTokenManager)
    const serviceRepository: IServiceRepository = new MongoServiceRepository(db);
    const ratingServiceProfileRepository: IRatingServiceProfileRepository = new MongoRatingServiceProfileRepository(db);

    server.router.post(`${ROUTE}`, authenticate(localJWTAuthorization), serviceProfileController.createProfile(accountRepository, serviceProfileRepository));
    server.router.patch(`${ROUTE}`, authenticate(localJWTAuthorization), serviceProfileController.updateProfileDetails(serviceProfileRepository));
    server.router.delete(`${ROUTE}`, authenticate(localJWTAuthorization), serviceProfileController.deleteProfileById(serviceProfileRepository));
    server.router.post(`${ROUTE}/display-picture`, authenticate(localJWTAuthorization), upload.single('profile-picture'), serviceProfileController.uploadProfilePicture(bucketStorage, serviceProfileRepository));
    server.router.delete(`${ROUTE}/display-picture`, authenticate(localJWTAuthorization), serviceProfileController.removeProfilePicture(bucketStorage, serviceProfileRepository));
    server.router.get(`${ROUTE}/location-search`, serviceProfileController.getAllServiceProfilesByLocation(serviceProfileRepository));
    server.router.get(`${ROUTE}/:service_profile_id/services`, serviceProfileController.getAllServicesByServiceProfileId(serviceRepository));
    server.router.get(`${ROUTE}/:service_profile_id/ratings`, serviceProfileController.getAllRatingToServiceProfile(ratingServiceProfileRepository));
    server.router.get(`${ROUTE}/:service_profile_id/availability`, serviceProfileController.getAllAvailability(serviceProfileAvailabilityRepository))
}