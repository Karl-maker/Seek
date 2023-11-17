import { NextFunction, Request, Response } from 'express';
import IMessengerQueue from '../../../helpers/event';
import HTTPError from '../../../utils/error';
import { IRatingServiceProfileRepository } from '../../../modules/rating-service-profile-repository';
import { IRatinfServiceProfileRemovePayload, IRatingServiceProfileAddedPayload, RatingServiceProfileTopics } from '../../../events/rating-service-profile';

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
                
                const result = await ratingServiceProfileRepository.create(data);
                const payload: IRatingServiceProfileAddedPayload = {
                    rating: result.element.rating,
                    service_profile_id: result.element.service_profile_id
                }
                this.event.publish(RatingServiceProfileTopics.ADDED, payload);
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
                const rating = await ratingServiceProfileRepository.findById(rating_service_profile_id);
                const result = await ratingServiceProfileRepository.deleteById(rating_service_profile_id);

                if(!result.success) throw new HTTPError("Issue Removing Rating", 500);
                
                const payload: IRatinfServiceProfileRemovePayload = {
                    rating_service_profile: rating
                };
                this.event.publish(RatingServiceProfileTopics.REMOVED, payload);

                res.json({
                    message: "Rating Removed"
                })
            } catch(err) {
                next(err)
            }
        }
    }
}