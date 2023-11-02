import { IMongoDB } from "../../helpers/database/mongo";
import IMessengerQueue from "../../helpers/event";
import NodeServer from "../../helpers/server"
import JWTService from "../../helpers/token/jwt";
import { IAccountRepository } from "../../modules/account-repository";
import { MongoAccountRepository } from "../../modules/account-repository/mongo";
import IAccountAuthentication, { IAuthorizePayload } from "../../services/account-authentication";
import LocalAccountAuthentication from "../../services/account-authentication/local";
import AccountController from "./controller";

const ROUTE = '/account';
const accessTokenManager = new JWTService<IAuthorizePayload>(
    {
        expiration: '30m',
        publicKey: 'secret',
        privateKey: 'secret',
        issuer: ''
    }
);
const refreshTokenManager = new JWTService<IAuthorizePayload>(
    {
        expiration: '30d',
        publicKey: 'secret',
        privateKey: 'secret',
        issuer: ''
    }
);

export default (server: NodeServer, db: IMongoDB, event: IMessengerQueue) => {
    const accountController = new AccountController(event);
    const accountRepository: IAccountRepository = new MongoAccountRepository(db);
    const localJWTAuthentication: IAccountAuthentication = new LocalAccountAuthentication(accountRepository, accessTokenManager, refreshTokenManager);

    server.app.post(
        `${ROUTE}/signup`,
        accountController.signup(localJWTAuthentication),
    );
}