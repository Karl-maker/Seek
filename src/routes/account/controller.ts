import { NextFunction, Response, Request } from 'express';
import IAccountAuthentication from '../../services/account-authentication';
import HTTPError from '../../utils/error';
import IMessengerQueue from '../../helpers/event';
import { AccountTopics, IAccountSignupPayload } from '../../events/account';

export default class AccountController {
    event: IMessengerQueue;
    constructor(messengerQueue: IMessengerQueue) {
        this.event = messengerQueue;
    }

    async signup(accountAuthentication: IAccountAuthentication){
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
}