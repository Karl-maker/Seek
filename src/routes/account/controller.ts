import { NextFunction, Response, Request } from 'express';
import IAccountAuthentication from '../../services/account-authentication';
import HTTPError from '../../utils/error';
import IMessengerQueue from '../../helpers/event';
import { AccountTopics, IAccountDeactivatePayload, IAccountDeletedPayload, IAccountLoginPayload, IAccountLogoutPayload, IAccountResetPasswordPayload, IAccountSignupPayload } from '../../events/account';
import { IAccountRepository } from '../../modules/account-repository';
import { getAccessTokenFromHeader } from '../../utils/bearer-token';
import IRetrieveRefreshToken from '../../services/retrieve-refresh-token';
import IAccountConfirmation from '../../services/account-confirmation';
import IAccountPasswordRecovery from '../../services/account-recovery';
import { IPasswordRecoveryToken } from '../../services/account-recovery/token';
import JWTService from '../../helpers/token/jwt';
import password from '../../utils/password';

export default class AccountController {
    event: IMessengerQueue;
    constructor(messengerQueue: IMessengerQueue) {
        this.event = messengerQueue;
    }

    getRefreshTokenFromRequest(retrieveRefreshToken: IRetrieveRefreshToken) {
        return (req: Request, res: Response, next: NextFunction) => {
            try{
                req['refresh_token'] = retrieveRefreshToken.retrieve(req);
                next();
            } catch(err) {
                next(err);
            }
        }
    }

    signup(accountAuthentication: IAccountAuthentication){
        return async (req: Request, res: Response, next: NextFunction) => {

            try {
                const data = req.body;
                const result = await accountAuthentication.signup({
                    ...data
                });
        
                if(result.success) {
                    req['result'] = result.account;

                    const payload: IAccountSignupPayload = {
                        account: result.account
                    }

                    this.event.publish(
                       AccountTopics.SIGNUP,
                       payload
                    );

                    res.json({
                        message: 'Account Registration Successful'
                    })
                } 
        
                next(new HTTPError(`Issue Signing Up, Try Again Later`, 500));
            } catch (err) {
                next(err);
            }
    
        }
    }

    logout(accountAuthentication: IAccountAuthentication){
        return async (req: Request, res: Response, next: NextFunction) => {
            try{
                const refresh = req['refresh_token'];
                const result = await accountAuthentication.logout(refresh);

                if(!result.success) {
                    throw new HTTPError(`Issue Logging Out`, 500);
                }

                const payload: IAccountLogoutPayload = {
                    account: result.account
                }

                this.event.publish(AccountTopics.LOGOUT, payload)

                res.json({
                    message: 'Logout Successful'
                });

            } catch(err) {
                next(err);
            }
        }
    }

    getAccessToken(accountAuthentication: IAccountAuthentication){
        return async (req: Request, res: Response, next: NextFunction) => {
            try{
                const refresh = req['refresh_token'];
                const result = await accountAuthentication.refresh(refresh);

                if(!result.access_token) {
                    throw new HTTPError(`Issue Getting Access Token`, 500);
                }

                res.json({
                    access_token: result.access_token
                });

            } catch(err) {
                next(err);
            }
        }
    }

    login(accountAuthentication: IAccountAuthentication){
        return async (req: Request, res: Response, next: NextFunction) => {
            try{
                const result = await accountAuthentication.login(req.body);

                if(!result.access_token) {
                    throw new HTTPError(`Login Issue`, 500);
                }

                const payload: IAccountLoginPayload = {
                    account: result.account
                }

                this.event.publish(AccountTopics.LOGIN, payload);

                res.json(result);

            } catch(err) {
                next(err);
            }
        }
    }

    current(accountRepository: IAccountRepository){
        return async (req: Request, res: Response, next: NextFunction) => {
            try{
                const user = req['user'];

                if(!user.id) {
                    throw new HTTPError(`Not Authorized`, 403);
                }

                const account = await accountRepository.findById(user.id);

                if(account.status !== "active") throw new HTTPError('No Account Found', 404)

                if(!account){
                    throw new HTTPError(`No Account Found`, 404);
                }

                if(account.password) delete account.password;

                res.json({
                    account
                });

            } catch(err) {
                next(err);
            }
        }
    }

    getAccountById(accountRepository: IAccountRepository){
        return async (req: Request, res: Response, next: NextFunction) => {
            try{
                const id = req.params.account_id;
                const result = await accountRepository.findById(id);

                delete result.password;

                if(!result) {
                    throw new HTTPError(`No Account Found`, 404);
                }

                res.json({
                    account: result
                });

            } catch(err) {
                next(err);
            }
        }
    }

    updateAccountById(accountRepository: IAccountRepository){
        return async (req: Request, res: Response, next: NextFunction) => {
            try{
                const data = req.body;
                const id = req.params.account_id;
                const result = await accountRepository.updateById(id,
                    {
                        ...data
                    }
                );

                if(!result.success) {
                    throw new HTTPError(`Issue Updating`, 500);
                }

                res.json({
                    message: `Update Successful`
                });

            } catch(err) {
                next(err);
            }
        }
    }

    createAccount(accountRepository: IAccountRepository){
        return async (req: Request, res: Response, next: NextFunction) => {
            try{
                const data = req.body;
                const result = await accountRepository.create(
                    {
                        ...data
                    }
                );

                if(!result.element) {
                    throw new HTTPError(`Issue Updating`, 500);
                }

                res.json({
                    message: `Created Successfully`,
                    account: result.element
                });

            } catch(err) {
                next(err);
            }
        }
    }

    deleteAccountById(accountRepository: IAccountRepository){
        return async (req: Request, res: Response, next: NextFunction) => {
            try{
                const id = req.params.account_id;
                const result = await accountRepository.deleteById(id);

                if(!result.success) {
                    throw new HTTPError(`Issue Deleting`, 500);
                }

                const payload: IAccountDeletedPayload = {
                    account: result.deletedElement
                }

                this.event.publish(AccountTopics.DELETE, payload);

                res.json({
                    message: `Delete Successful`
                });

            } catch(err) {
                next(err);
            }
        }
    }

    deactivateAccountById(accountRepository: IAccountRepository){
        return async (req: Request, res: Response, next: NextFunction) => {
            try{
                const reason = req.body.reason;
                const id = req['user'].id;
                const result = await accountRepository.updateById(id, {
                    status: 'deactivated'
                });

                if(!result.success) {
                    throw new HTTPError(`Issue Deactivating`, 500);
                }

                const payload: IAccountDeactivatePayload = {
                    account: result.element,
                    reason
                };

                this.event.publish(AccountTopics.DEACTIVATE, payload);

                res.json({
                    message: `Deactivated Successful`
                });

            } catch(err) {
                next(err);
            }
        }
    }

    sendConfirmationCode(accountRepository: IAccountRepository, accountConfirmation: IAccountConfirmation) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try{
                const id = req['user'].id;
                const account = await accountRepository.findById(id);
                accountConfirmation.generate(account);
    
                res.json({
                    message: `Check your ${account['mobile'] ? 'mobile messages' : 'email'} for confirmation code`
                })
            }catch (err) {
                next(err);
            }
        }
    }

    checkConfirmationCode(accountConfirmation: IAccountConfirmation) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try{
                const id = req['user'].id;
                const code = req.body.code;
                const result = await accountConfirmation.check(id, code);
                let message = "Account Failed To Be Confirmed"
                if(result.confirmed) {
                    message = "Account Confirmed"
                }
    
                res.json({
                   message
                });
            } catch(err) {
                next(err)
            }
        }
    }

    recoverPassword(passwordRecovery: IAccountPasswordRecovery) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try {
                const {
                    email,
                    mobile
                } = req.query;

                await passwordRecovery.sendRecoveryDetails({
                    email: String(email || ''), 
                    mobile: String(mobile || '')
                });

                res.json({
                    message: `Check ${mobile ? "mobile messages" : "email inbox"} for password recovery details`
                })
            } catch(err) {
                next(err)
            }
        }
    }

    resetPasswordWithToken(accountRepository: IAccountRepository, tokenManager: JWTService<IPasswordRecoveryToken>) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const password = req.body.password;
                const token = req["query"].token;
                const payload = await tokenManager.verifyToken(String(token || ""));
                const result = await accountRepository.updateById(payload.sub, {
                    password: await password.hash(password)
                });

                const eventPayload: IAccountResetPasswordPayload = {
                    account: result.element
                }

                this.event.publish(AccountTopics.PASSWORD_RESET, eventPayload)

                res.json({
                    message: "Password Updated"
                })
            } catch(err) {
                next(err)
            }
        }
    }
}