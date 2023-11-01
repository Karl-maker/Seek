import IAccountAuthentication, { IAuthorizePayload, ICredentials, ILoginResponse, ILogoutResponse, IRefreshPayload } from "..";
import JWTService from "../../../helpers/token/jwt";
import { IAccountRepository } from "../../../modules/account-repository";
import HTTPError from "../../../utils/error";
import PasswordUtils from "../../../utils/password";

interface IRefreshTokenPayload {
    sub: string | number;
}

export default class LocalAccountAuthentication implements IAccountAuthentication {
    accountRepository: IAccountRepository;
    accessToken: {
        expiration: string;
        privateKey: string;
        issuer: string;
        publicKey: string;
    }
    refreshToken: {
        expiration: string;
        privateKey: string;
        issuer: string;
        publicKey: string;
    }

    constructor(accountRepository: IAccountRepository) {
        this.accountRepository = accountRepository;
    }

    async login(credentials: ICredentials): Promise<ILoginResponse> {
        const password = credentials.password;
        delete credentials.password;
        const account = await this.accountRepository.findOne({
            ...credentials,
        });

        if(!account) throw new HTTPError(`Password or Credentials are wrong`, 401);
        if(!PasswordUtils.compare(password, account.password)) throw new HTTPError(`Password or Credentials are wrong`, 401);

        // generate tokens

        const access_token = new JWTService<IAuthorizePayload>({
            expiration: this.accessToken.expiration || "30m",
            privateKey: this.accessToken.privateKey || "secret",
            publicKey: this.accessToken.publicKey || "secret",
            issuer: this.accessToken.issuer || ""
        }).createToken({
            sub: account._id,
            role: account.role
        });

        const refresh_token = new JWTService<IRefreshTokenPayload>({
            expiration: this.accessToken.expiration || "30m",
            privateKey: this.accessToken.privateKey || "secret",
            publicKey: this.accessToken.publicKey || "secret",
            issuer: this.accessToken.issuer || ""
        }).createToken({
            sub: account._id
        });

        return {
            access_token,
            refresh_token
        }
    }

    async authorize(access_token: string): Promise<IAuthorizePayload> {
        const payload = new JWTService<IAuthorizePayload>({
            expiration: this.accessToken.expiration || "30m",
            privateKey: this.accessToken.privateKey || "secret",
            publicKey: this.accessToken.publicKey || "secret",
            issuer: this.accessToken.issuer || ""
        }).verifyToken(access_token);

        if (!payload) {
            throw new HTTPError(`Access token is invalid or expired`, 401);
        }

        return payload;
    }

    async refresh(refresh_token: string): Promise<IRefreshPayload> {
        // Verify the refresh token
        const payload = new JWTService<IRefreshTokenPayload>({
            expiration: this.refreshToken.expiration || "7d", // Define refresh token expiration
            privateKey: this.refreshToken.privateKey || "refresh-secret",
            publicKey: this.refreshToken.publicKey || "refresh-secret",
            issuer: this.refreshToken.issuer || ""
        }).verifyToken(refresh_token);

        if (!payload) {
            throw new HTTPError(`Refresh token is invalid or expired`, 401);
        }

        const account = await this.accountRepository.findById(payload.sub);

        // Generate a new access token using the user ID
        const new_access_token = new JWTService<IAuthorizePayload>({
            expiration: this.accessToken.expiration || "30m",
            privateKey: this.accessToken.privateKey || "secret",
            publicKey: this.accessToken.publicKey || "secret",
            issuer: this.accessToken.issuer || ""
        }).createToken({
            sub: payload.sub,
            role: account.role
        });

        return {
            access_token: new_access_token,
        };
    }

    async logout(account_id: string): Promise<ILogoutResponse> {
        return {
            success: true
        }
    }
}