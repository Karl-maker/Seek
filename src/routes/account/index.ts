import { config } from "../../config";
import { IMongoDB } from "../../helpers/database/mongo";
import IMessengerQueue from "../../helpers/event";
import NodeServer from "../../helpers/server"
import JWTService from "../../helpers/token/jwt";
import { authenticate } from "../../middlewares/auth";
import { IAccountRepository } from "../../modules/account-repository";
import { MongoAccountRepository } from "../../modules/account-repository/mongo";
import { ILoginRepository } from "../../modules/login-repository";
import { MongoLoginRepository } from "../../modules/login-repository/mongo";
import IAccountAuthentication, { IAuthorizePayload, IRefreshTokenPayload } from "../../services/account-authentication";
import LocalAccountAuthentication from "../../services/account-authentication/local";
import IAccountConfirmation from "../../services/account-confirmation";
import AccountConfirmationWithPin from "../../services/account-confirmation/pin";
import IAccountPasswordRecovery, { IPasswordRecovery } from "../../services/account-recovery";
import AccountPasswordRecoveryWithToken, { IPasswordRecoveryToken } from "../../services/account-recovery/token";
import IRetrieveRefreshToken from "../../services/retrieve-refresh-token";
import RetrieveRefreshTokenFromWeb from "../../services/retrieve-refresh-token/web";
import AccountController from "./controller";
import cookieParser from "cookie-parser";

const ROUTE = '/account';
const accessTokenManager = new JWTService<IAuthorizePayload>(
    {
        expiration: '30m',
        publicKey: config.token.access.public,
        privateKey: config.token.access.private,
        issuer: config.token.access.issuer,
    }
);
const refreshTokenManager = new JWTService<IRefreshTokenPayload>(
    {
        expiration: '30d',
        publicKey: config.token.refresh.public,
        privateKey: config.token.refresh.private,
        issuer: config.token.refresh.issuer,
    }
);
const passwordRecoveryManager = new JWTService<IPasswordRecoveryToken>(
    {
        expiration: '15m',
        publicKey: config.token.general.public,
        privateKey: config.token.general.private,
        issuer: config.token.general.issuer,
    }
);

const retrieveRefreshToken: IRetrieveRefreshToken = new RetrieveRefreshTokenFromWeb();

export default (server: NodeServer, db: IMongoDB, event: IMessengerQueue) => {
    const accountController = new AccountController(event);
    const accountRepository: IAccountRepository = new MongoAccountRepository(db);
    const loginRepository: ILoginRepository = new MongoLoginRepository(db);
    const localJWTAuthentication: IAccountAuthentication = new LocalAccountAuthentication(
        accountRepository, 
        loginRepository, 
        accessTokenManager, 
        refreshTokenManager
    );
    const accountConfirmation: IAccountConfirmation = new AccountConfirmationWithPin(accountRepository);
    const passwordRecovery: IAccountPasswordRecovery = new AccountPasswordRecoveryWithToken(accountRepository, passwordRecoveryManager);

    server.app.post(`${ROUTE}/signup`, accountController.signup(localJWTAuthentication));
    server.app.post(`${ROUTE}/login`, accountController.login(localJWTAuthentication));
    server.app.post(`${ROUTE}/logout`, cookieParser(), accountController.getRefreshTokenFromRequest(retrieveRefreshToken), accountController.logout(localJWTAuthentication));
    server.app.post(`${ROUTE}/refresh`, cookieParser(),accountController.getRefreshTokenFromRequest(retrieveRefreshToken), accountController.getAccessToken(localJWTAuthentication));
    server.app.get(`${ROUTE}`, accountController.current(localJWTAuthentication, accountRepository));
    server.app.get(`${ROUTE}/:account_id`, authenticate(localJWTAuthentication), accountController.getAccountById(accountRepository));
    server.app.delete(`${ROUTE}/deactivate`, authenticate(localJWTAuthentication), accountController.deactivateAccountById(accountRepository));
    server.app.patch(`${ROUTE}/:account_id`, authenticate(localJWTAuthentication, 'admin'), accountController.updateAccountById(accountRepository));
    server.app.post(`${ROUTE}`, authenticate(localJWTAuthentication, 'admin'), accountController.createAccount(accountRepository));
    server.app.post(`${ROUTE}/confirmation`, authenticate(localJWTAuthentication), accountController.checkConfirmationCode(accountConfirmation));
    server.app.get(`${ROUTE}/confirmation`, authenticate(localJWTAuthentication), accountController.sendConfirmationCode(accountRepository, accountConfirmation));
    server.app.delete(`${ROUTE}/:account_id`, authenticate(localJWTAuthentication, 'admin'), accountController.deleteAccountById(accountRepository));
    server.app.post(`${ROUTE}/reset-password`, accountController.resetPasswordWithToken(accountRepository, passwordRecoveryManager));
    server.app.post(`${ROUTE}/password-recovery`, accountController.recoverPassword(passwordRecovery));
}