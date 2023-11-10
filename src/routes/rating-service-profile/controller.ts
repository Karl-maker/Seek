import { NextFunction, Request, Response } from 'express';
import IMessengerQueue from '../../helpers/event';
import HTTPError from '../../utils/error';
import { IRatingServiceProfileRepository } from '../../modules/rating-service-profile-repository';

export default class RatingServiceProfileController {
    event: IMessengerQueue;
    constructor(messengerQueue: IMessengerQueue) {
        this.event = messengerQueue;
    }

    addRatingToServiceProfile(ratingServiceProfileRepository: IRatingServiceProfileRepository){
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const data = req.body;
                data.rated_by = {
                    account_id: req['user'].id,
                };
                
                await ratingServiceProfileRepository.create(data);
                    
                res.json({
                    message: "Rating Added"
                })
            } catch(err) {
                next(err)
            }
        }
    }
    removeRatingToServiceProfile(ratingServiceProfileRepository: IRatingServiceProfileRepository){
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const { rating_service_profile_id } = req.params;
                const result = await ratingServiceProfileRepository.deleteById(rating_service_profile_id);

                if(!result.success) throw new HTTPError("Issue Removing Rating", 500);
                    
                res.json({
                    message: "Rating Removed"
                })
            } catch(err) {
                next(err)
            }
        }
    }

}