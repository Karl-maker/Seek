import { NextFunction, Request, Response } from 'express';
import IMessengerQueue from '../../helpers/event';
import { IServiceProfileRepository } from '../../modules/service-profile-repository';
import HTTPError from '../../utils/error';
import { IBucketStorage } from '../../helpers/bucket';
import { IServiceRepository } from '../../modules/service-repository';

export default class ServiceController {
    event: IMessengerQueue;
    constructor(messengerQueue: IMessengerQueue) {
        this.event = messengerQueue;
    }

    createService(serviceRepository: IServiceRepository, serviceProfileRepository: IServiceProfileRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const account_id = req['user'].id;
                const data = req.body;

                const serviceProfile = await serviceProfileRepository.findOne({
                    account_id
                });

                if(!serviceProfile) {
                    throw new HTTPError(`Profile Not Found`, 404);
                }

                const service = await serviceRepository.create({
                    ...data,
                    service_profile_id: serviceProfile._id
                })

                res.json({
                    service_profile: service.element,
                    message: "Service Created"
                });
                
            } catch(err) {
                next(err)
            }
        }
    }
    updateService(serviceRepository: IServiceRepository, serviceProfileRepository: IServiceProfileRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const account_id = req['user'].id;
                const data = req.body;
                const id = req.params.service_id;

                const serviceProfile = await serviceProfileRepository.findOne({
                    account_id
                });

                if(!serviceProfile) {
                    throw new HTTPError(`Profile Not Found`, 404);
                }

                const service = await serviceRepository.updateOne({
                    service_profile_id: serviceProfile._id,
                    id
                }, {
                    ...data,
                })

                res.json({
                    service_profile: service.element,
                    message: "Service Updated"
                });
                
            } catch(err) {
                next(err)
            }
        }
    }
    getServiceById(serviceRepository: IServiceRepository, serviceProfileRepository: IServiceProfileRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const account_id = req['user'].id;
                const id = req.params.service_id;

                const serviceProfile = await serviceProfileRepository.findOne({
                    account_id
                });

                if(!serviceProfile) {
                    throw new HTTPError(`Profile Not Found`, 404);
                }

                const service = await serviceRepository.findOne({
                    service_profile_id: serviceProfile._id,
                    id
                })

                res.json({
                    service_profile: service,
                });
                
            } catch(err) {
                next(err)
            }
        }
    }
    deleteServiceById(serviceRepository: IServiceRepository, serviceProfileRepository: IServiceProfileRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const account_id = req['user'].id;
                const id = req.params.service_id;

                const serviceProfile = await serviceProfileRepository.findOne({
                    account_id
                });

                if(!serviceProfile) {
                    throw new HTTPError(`Profile Not Found`, 404);
                }

                const service = await serviceRepository.deleteMany({
                    service_profile_id: serviceProfile._id,
                    id
                })

                res.json({
                    message: 'Deleted Successfully'
                });
                
            } catch(err) {
                next(err)
            }
        }
    }

}