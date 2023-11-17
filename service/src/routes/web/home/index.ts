import { config } from "../../../config";
import { IMongoDB } from "../../../helpers/database/mongo";
import IMessengerQueue from "../../../helpers/event";
import JWTService from "../../../helpers/token/jwt";
import IServer from "../../../helpers/server";
import { IAuthorizePayload } from "../../../services/account-authorization";
import HomeViewController from "./controller";

const ROUTE = '/';
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
    const homePage = new HomeViewController(event);
    server.router.get("/", homePage.homePageController());
}