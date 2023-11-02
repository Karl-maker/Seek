import { config } from "../../config";
import { IMongoDB } from "../../helpers/database/mongo";
import IMessengerQueue from "../../helpers/event";
import NodeServer from "../../helpers/server"
import JWTService from "../../helpers/token/jwt";
import { authenticate } from "../../middlewares/auth";
import { IAccountRepository } from "../../modules/account-repository";
import { MongoAccountRepository } from "../../modules/account-repository/mongo";
import IAccountAuthentication, { IAuthorizePayload } from "../../services/account-authentication";
import LocalAccountAuthentication from "../../services/account-authentication/local";
import AccountController from "./controller";

const ROUTE = '/account';
const accessTokenManager = new JWTService<IAuthorizePayload>(
    {
        expiration: '30m',
        publicKey: config.token.access.public,
        privateKey: config.token.access.private,
        issuer: config.token.access.issuer,
    }
);
const refreshTokenManager = new JWTService<IAuthorizePayload>(
    {
        expiration: '30d',
        publicKey: config.token.refresh.public,
        privateKey: config.token.refresh.private,
        issuer: config.token.refresh.issuer,
    }
);

export default (server: NodeServer, db: IMongoDB, event: IMessengerQueue) => {
    const accountController = new AccountController(event);
    const accountRepository: IAccountRepository = new MongoAccountRepository(db);
    const localJWTAuthentication: IAccountAuthentication = new LocalAccountAuthentication(accountRepository, accessTokenManager, refreshTokenManager);

    server.app.post(`${ROUTE}/signup`, accountController.signup(localJWTAuthentication));
    server.app.post(`${ROUTE}/login`, accountController.login(localJWTAuthentication));
    server.app.get(`${ROUTE}`, accountController.current(localJWTAuthentication, accountRepository));
    server.app.get(`${ROUTE}/:account_id`, authenticate(localJWTAuthentication), accountController.getAccountById(accountRepository));
    server.app.patch(`${ROUTE}/:account_id`, authenticate(localJWTAuthentication, 'admin'), accountController.updateAccountById(accountRepository));
    server.app.post(`${ROUTE}`, authenticate(localJWTAuthentication, 'admin'), accountController.createAccount(accountRepository));

}