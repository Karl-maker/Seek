import { NextFunction, Response, Request } from 'express';
import IAccountAuthentication from '../../services/account-authentication';
import HTTPError from '../../utils/error';
import IMessengerQueue from '../../helpers/event';
import { AccountTopics, IAccountLoginPayload, IAccountSignupPayload } from '../../events/account';
import { IAccountRepository } from '../../modules/account-repository';
import { getAccessTokenFromHeader } from '../../utils/bearer-token';

export default class AccountController {
    event: IMessengerQueue;
    constructor(messengerQueue: IMessengerQueue) {
        this.event = messengerQueue;
    }

    signup(accountAuthentication: IAccountAuthentication){
        return async (req: Request, res: Response, next: NextFunction) => {

            try {
                const result = await accountAuthentication.signup({
                    ...req.body
                });
        
                if(result.success) {
                    req.result = result.account;

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

    current(accountAuthentication: IAccountAuthentication, accountRepository: IAccountRepository){
        return async (req: Request, res: Response, next: NextFunction) => {
            try{
                const result = await accountAuthentication.authorize(getAccessTokenFromHeader(req));

                if(!result.sub) {
                    throw new HTTPError(`Not Authorized`, 403);
                }

                const account = await accountRepository.findOne({
                    id: result.sub,
                    status: 'active'
                });

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
                const result = await accountRepository.findById(req.params.account_id);

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
                const result = await accountRepository.updateById(req.params.account_id,
                    {
                        ...req.body.data
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
                const result = await accountRepository.create(
                    {
                        ...req.body.data
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
                const result = await accountRepository.deleteById(req.params.account_id);

                if(!result.success) {
                    throw new HTTPError(`Issue Deleting`, 500);
                }

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
                const result = await accountRepository.updateById(req.user.id, {
                    status: 'deactivated'
                });

                if(!result.success) {
                    throw new HTTPError(`Issue Deactivating`, 500);
                }

                res.json({
                    message: `Deactivated Successful`
                });

            } catch(err) {
                next(err);
            }
        }
    }
}