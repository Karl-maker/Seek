import IAccountAuthentication, { ICredentials, ILoginResponse, ILogoutResponse, IRefreshPayload, ISignupResponse, IRefreshTokenPayload } from "..";
import { ITokenManager } from "../../../helpers/token";
import { IAccount, IAccountRepository } from "../../../modules/account-repository";
import { ILoginRepository } from "../../../modules/login-repository";
import HTTPError from "../../../utils/error";
import PasswordUtils from "../../../utils/password";
import { IAuthorizePayload } from "../../account-authorization";

export default class LocalAccountAuthentication implements IAccountAuthentication {
    accountRepository: IAccountRepository;
    loginRepository: ILoginRepository;
    accessTokenManager: ITokenManager<IAuthorizePayload>;
    refreshTokenManager: ITokenManager<IRefreshTokenPayload>;

    constructor(
        accountRepository: IAccountRepository, 
        loginRepository: ILoginRepository,
        accessTokenManager: ITokenManager<IAuthorizePayload>, 
        refreshTokenManager: ITokenManager<IRefreshTokenPayload>
        ) {
        this.accountRepository = accountRepository;
        this.loginRepository = loginRepository;
        this.refreshTokenManager = refreshTokenManager;
        this.accessTokenManager = accessTokenManager;
    }

    async login(credentials: ICredentials): Promise<ILoginResponse> {
        const password = credentials.password;
        delete credentials.password;
        const account = await this.accountRepository.findOne({
            ...credentials,
        });

        if(!account) throw new HTTPError(`Password or Credentials are wrong`, 401);
        if(!PasswordUtils.compare(password, account.password)) throw new HTTPError(`Password or Credentials are wrong`, 401);

        const loginDetail = await this.loginRepository.create({
            method: 'jwt',
            account_id: account._id
        });

        // generate tokens

        const access_token = this.accessTokenManager.createToken({
            sub: account._id,
            role: account.role
        });

        const refresh_token = this.refreshTokenManager.createToken({
            sub: account._id,
            session: {
                id: loginDetail.element._id
            }
        });

        return {
            access_token,
            refresh_token,
            account
        }
    }

    async refresh(refresh_token: string): Promise<IRefreshPayload> {
        // Verify the refresh token
        const payload = this.refreshTokenManager.verifyToken(refresh_token);

        if (!payload) {
            throw new HTTPError(`Refresh token is invalid or expired`, 401);
        }

        const account = await this.accountRepository.findById(payload.sub);
        const login = await this.loginRepository.findById(payload.session.id);

        if(!login) {
            throw new HTTPError(`Refresh token is invalid or expired`, 401);
        }

        // Generate a new access token using the user ID
        const new_access_token = this.accessTokenManager.createToken({
            sub: payload.sub,
            role: account.role
        });

        return {
            access_token: new_access_token,
        };
    }

    async logout(refresh_token: string): Promise<ILogoutResponse> {
        const payload = this.refreshTokenManager.verifyToken(refresh_token);

        if (!payload) {
            throw new HTTPError(`Refresh token is invalid or expired`, 401);
        }
        const account = await this.accountRepository.findById(payload.session.id);
        if(!account) new HTTPError(`Account Not Found`, 404);
        const result = await this.loginRepository.deleteById(payload.session.id);
        return {
            success: result.success,
            account
        }
    }

    async signup(data: IAccount): Promise<ISignupResponse>{
        try{
            const new_account = await this.accountRepository.create(data);
            if(!new_account.element) throw new HTTPError(`Issue Creating Account`, 500);

            return {
                success: true,
                account: new_account.element
            }

        } catch(err) {
            throw new HTTPError(err.message, 500);
        }
    }
}