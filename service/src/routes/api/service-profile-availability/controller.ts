import { NextFunction, Request, Response } from 'express';
import IMessengerQueue from '../../../helpers/event';
import IServiceProfileAvailabilityRepository from '../../../modules/service-profile-availability-repository';
import HTTPError from '../../../utils/error';
import { IServiceProfileAvailabilityAddPayload, ServiceProfileAvailabilityTopics } from '../../../events/service-profile-availability';

export default class ServiceProfileController {
    event: IMessengerQueue;
    constructor(messengerQueue: IMessengerQueue) {
        this.event = messengerQueue;
    }

    createAvailability(serviceProfileAvailabilityRepository: IServiceProfileAvailabilityRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const data = req.body;
                const account_id = req['user'].id;
                data['account_id'] = account_id;
                const availability = await serviceProfileAvailabilityRepository.create(data);

                const payload: IServiceProfileAvailabilityAddPayload = {
                    service_profile_id: availability.element.service_profile_id,
                    availability: availability.element
                }
                
                this.event.publish(ServiceProfileAvailabilityTopics.ADD, payload);

                res.json({
                    message: "Availability Slot Created",
                    availability
                })
            } catch(err) {
                next(err)
            }
        }
    }
    deleteAvailability(serviceProfileAvailabilityRepository: IServiceProfileAvailabilityRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const id = req.params.service_profile_availability_id;
                const availability = await serviceProfileAvailabilityRepository.deleteById(id);

                if(availability.success){
                    throw new HTTPError('Issue Deleting Availability', 500);
                }

                res.json({
                    message: "Availability Slot Deleted"
                })
            } catch(err) {
                next(err)
            }
        }
    }
    getAllAvailabilityByServiceProfileId(serviceProfileAvailabilityRepository: IServiceProfileAvailabilityRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const id = req.params.service_profile_id;
                const availabilities = await serviceProfileAvailabilityRepository.findMany({
                    service_profile_id: id
                });

                res.json({
                    availabilities: availabilities.elements,
                    count: availabilities.amount
                })
            } catch(err) {
                next(err)
            }
        }
    }

}