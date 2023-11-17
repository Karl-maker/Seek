import { NextFunction, Request, Response } from 'express';
import IMessengerQueue from '../../../helpers/event';

export default class HomeViewController {
    event: IMessengerQueue;
    constructor(messengerQueue: IMessengerQueue) {
        this.event = messengerQueue;
    }

    homePageController(){
        return async(req: Request, res: Response, next: NextFunction) => {
            res.render('home', { title: 'Handlebars Example', message: 'Hello, Handlebars!' });
        }
    }

}