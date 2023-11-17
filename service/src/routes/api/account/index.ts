import { config } from "../../../config";
import { AccountTopics } from "../../../events/account";
import { IMongoDB } from "../../../helpers/database/mongo";
import IEmail from "../../../helpers/email";
import NodeMailer from "../../../helpers/email/nodemailer";
import IMessengerQueue from "../../../helpers/event";
import ISMS from "../../../helpers/sms";
import TwilioSMS from "../../../helpers/sms/twilio";
import JWTService from "../../../helpers/token/jwt";
import { authenticate } from "../../../middlewares/authorize";
import { IAccountConfirmationRepository } from "../../../modules/account-confirmation-repository";
import { MongoAccountConfirmationRepository } from "../../../modules/account-confirmation-repository/mongo";
import { IAccountRepository } from "../../../modules/account-repository";
import { MongoAccountRepository } from "../../../modules/account-repository/mongo";
import { ILoginRepository } from "../../../modules/login-repository";
import { MongoLoginRepository } from "../../../modules/login-repository/mongo";
import IAccountAuthentication, { IRefreshTokenPayload } from "../../../services/account-authentication";
import LocalAccountAuthentication from "../../../services/account-authentication/local";
import IAccountAuthorization, { IAuthorizePayload } from "../../../services/account-authorization";
import LocalAccountAuthorization from "../../../services/account-authorization/local";
import IAccountConfirmation from "../../../services/account-confirmation";
import AccountConfirmationWithPin from "../../../services/account-confirmation/pin";
import IAccountPasswordRecovery from "../../../services/account-recovery";
import AccountPasswordRecoveryWithToken, { IPasswordRecoveryToken } from "../../../services/account-recovery/token";
import IRetrieveRefreshToken from "../../../services/retrieve-refresh-token";
import RetrieveRefreshTokenFromWeb from "../../../services/retrieve-refresh-token/web";
import AccountController from "./controller";
import cookieParser from "cookie-parser";
import IIpLookup from "../../../services/ip-lookup";
import GeoIpLite from "../../../services/ip-lookup/geoIp";
import IServer from "../../../helpers/server";

const ROUTE = '/account';
const sms: ISMS = new TwilioSMS(config.twilio.account_sid, config.twilio.auth_token, config.twilio.number);
const email: IEmail = new NodeMailer({
    service: config.nodemailer.service,
    host: config.nodemailer.host,
    port: Number(config.nodemailer.port),
    auth: {
        user: config.nodemailer.auth.user,
        pass: config.nodemailer.auth.password,
    },
    secure: false
})
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

/**
 * @TODO add validation
 */

export default (server: IServer, db: IMongoDB, event: IMessengerQueue) => {
    const accountController = new AccountController(event);
    const accountRepository: IAccountRepository = new MongoAccountRepository(db);
    const accountConfirmationRepository: IAccountConfirmationRepository = new MongoAccountConfirmationRepository(db);
    const loginRepository: ILoginRepository = new MongoLoginRepository(db);
    const localJWTAuthentication: IAccountAuthentication = new LocalAccountAuthentication(accountRepository, loginRepository, accessTokenManager, refreshTokenManager);
    const accountConfirmation: IAccountConfirmation = new AccountConfirmationWithPin(accountRepository, accountConfirmationRepository, sms, email);
    const passwordRecovery: IAccountPasswordRecovery = new AccountPasswordRecoveryWithToken(accountRepository, passwordRecoveryManager, sms, email);
    const ipLookup: IIpLookup = new GeoIpLite();
    const localJWTAuthorization: IAccountAuthorization = new LocalAccountAuthorization(accessTokenManager)

    server.router.post(`${ROUTE}/signup`, accountController.signup(localJWTAuthentication));
    server.router.post(`${ROUTE}/login`, accountController.login(localJWTAuthentication)); 
    server.router.post(`${ROUTE}/logout`, cookieParser(), accountController.getRefreshTokenFromRequest(retrieveRefreshToken), accountController.logout(localJWTAuthentication));
    server.router.post(`${ROUTE}/refresh`, cookieParser(),accountController.getRefreshTokenFromRequest(retrieveRefreshToken), accountController.getAccessToken(localJWTAuthentication));
    server.router.get(`${ROUTE}/confirmation`, authenticate(localJWTAuthorization), accountController.sendConfirmationCode(accountRepository, accountConfirmation));
    server.router.get(`${ROUTE}`, authenticate(localJWTAuthorization), accountController.current(accountRepository));
    server.router.delete(`${ROUTE}/deactivate`, authenticate(localJWTAuthorization), accountController.deactivateAccountById(accountRepository));
    server.router.post(`${ROUTE}`, authenticate(localJWTAuthorization, 'admin'), accountController.createAccount(accountRepository));
    server.router.post(`${ROUTE}/confirmation`, authenticate(localJWTAuthorization), accountController.checkConfirmationCode(accountConfirmation, accountRepository));
    server.router.post(`${ROUTE}/reset-password`, accountController.resetPasswordWithToken(accountRepository, passwordRecoveryManager));
    server.router.post(`${ROUTE}/password-recovery`, accountController.recoverPassword(passwordRecovery));
    server.router.patch(`${ROUTE}/:account_id`, authenticate(localJWTAuthorization, 'admin'), accountController.updateAccountById(accountRepository));
    server.router.delete(`${ROUTE}/:account_id`, authenticate(localJWTAuthorization, 'admin'), accountController.deleteAccountById(accountRepository));
    server.router.get(`${ROUTE}/:account_id`, accountController.getAccountById(accountRepository));

    event.subscribe(AccountTopics.SIGNUP, accountController.sendConfirmationCodeEvent(accountConfirmation));
    event.subscribe(AccountTopics.LOGIN, accountController.loginLocationCheckEvent(loginRepository, ipLookup));
}