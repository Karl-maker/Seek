import { NextFunction, Request, Response } from 'express';
import IMessengerQueue from '../../../helpers/event';
import { IAccountRepository } from '../../../modules/account-repository';
import { IServiceProfileRepository } from '../../../modules/service-profile-repository';
import HTTPError from '../../../utils/error';
import { IServiceProfileCreatePayload, IServiceProfileUpdateLocationPayload, IServiceProfileUpdatePayload, IServiceProfileUploadedPicturePayload, ServiceProfileTopics } from '../../../events/service-profile';
import { IBucketStorage } from '../../../helpers/bucket';
import { IServiceRepository } from '../../../modules/service-repository';
import { IRatingServiceProfileRepository } from '../../../modules/rating-service-profile-repository';
import IServiceProfileAvailabilityRepository from '../../../modules/service-profile-availability-repository';

export default class ServiceProfileController {
    event: IMessengerQueue;
    constructor(messengerQueue: IMessengerQueue) {
        this.event = messengerQueue;
    }

    createProfile(accountRepository: IAccountRepository, serviceProfileRepository: IServiceProfileRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const account_id = req['user'].id;
                const data = req.body;
                const account = await accountRepository.findById(account_id);

                const found = await serviceProfileRepository.findMany({
                    account_id
                });

                if(found.amount > 0) {
                    throw new HTTPError(`Service Profile Already Made`, 401);
                }

                const service = await serviceProfileRepository.create({
                    ...data,
                    first_name: account.first_name,
                    last_name: account.last_name,
                    account_id
                });

                const payload: IServiceProfileCreatePayload = {
                    account,
                    service_profile: service.element
                }

                this.event.publish(ServiceProfileTopics.CREATE, payload);

                res.json({
                    service_profile: service.element,
                    message: "Profile Created"
                });
                
            } catch(err) {
                next(err)
            }
        }
    }
    getAllServiceProfilesByLocation(serviceProfileRepository: IServiceProfileRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{

                const {
                    country,
                    area, 
                    page_size,
                    page_number,
                    sort_order = 'asc'
                } = req.query;

                const serviceProfiles = await serviceProfileRepository.findManyByArea({
                    country: String(country),
                    area: String(area)
                },
                {
                    page: {
                        size: Number(page_size),
                        number: Number(page_number)
                    },
                    sort: {
                        field: 'last_name', // Replace with the field you want to sort by
                        direction: sort_order === 'asc' ? 'asc' : 'desc'
                    }
                }
                );


                res.json({
                    service_profiles: serviceProfiles.elements,
                    count: serviceProfiles.amount
                });
                
            } catch(err) {
                next(err)
            }
        }
    }    
    uploadProfilePicture(storage: IBucketStorage, serviceProfileRepository: IServiceProfileRepository) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const account_id = req['user'].id;
                const service = await serviceProfileRepository.findById(account_id);

                storage.save(req['file'].filename, async (url: string, error?: Error) => {
                    if(error) throw new HTTPError(error.message, 500);
                    await serviceProfileRepository.updateById(service.id, {
                        picture: url
                    });
                    const payload: IServiceProfileUploadedPicturePayload = {
                        service_profile: service
                    }
                    this.event.publish(ServiceProfileTopics.UPLOAD_PICTURE, payload)
                    res.json('Added Picture');
                });
            } catch(err) {
                next(err);
            }
        }
    }
    removeProfilePicture(storage: IBucketStorage, serviceProfileRepository: IServiceProfileRepository) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const account_id = req['user'].id;
                const service = await serviceProfileRepository.findById(account_id);

                storage.delete(service.picture, async (success: boolean, error?: Error) => {
                    if(error) throw new HTTPError(error.message, 500);
                    if(!success) throw new HTTPError('Issue removing', 500);

                    await serviceProfileRepository.updateById(service.id, {
                        picture: ""
                    });

                    res.json('Removed Picture');
                });
            } catch(err) {
                next(err);
            }
        }
    }
    updateProfileDetails(serviceProfileRepository: IServiceProfileRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const account_id = req['user'].id;
                const data = req.body;

                const service = await serviceProfileRepository.updateOne({
                    account_id
                }, {
                    ...data,
                });

                const payload: IServiceProfileUpdatePayload = {
                    service_profile: {
                        _id: service.element.id,
                        id: service.element.id,
                        ...data
                    }
                }
                
                this.event.publish(ServiceProfileTopics.UPDATE, payload)

                res.json({
                    service_profile: service.element,
                    message: "Profile Created"
                });
                
            } catch(err) {
                next(err)
            }
        }
    }
    deleteProfileById(serviceProfileRepository: IServiceProfileRepository) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = req.params.service_profile_id;
                const service = await serviceProfileRepository.deleteById(id);
                res.json({
                    message: 'Profile Deleted',
                });

                const payload: IServiceProfileUpdatePayload = {
                    service_profile: service.deletedElement
                }
                this.event.publish(ServiceProfileTopics.DELETE, payload)
            } catch(err) {
                next(err);
            }
        }
    }
    getAllServicesByServiceProfileId(serviceRepository: IServiceRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{

                const id = req.params.service_profile_id;

                const service = await serviceRepository.findMany({
                    service_profile_id: id
                })

                res.json({
                    services: service.elements,
                    amount: service.amount
                });
                
            } catch(err) {
                next(err)
            }
        }
    }
    getAllRatingToServiceProfile(ratingServiceProfileRepository: IRatingServiceProfileRepository){
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const { service_profile_id } = req.params;
                const result = await ratingServiceProfileRepository.findMany({
                    service_profile_id
                });
                    
                res.json({
                    amount: result.amount,
                    ratings: result.elements
                })
            } catch(err) {
                next(err)
            }
        }
    }
    getAllAvailability(serviceProfileAvailabilityRepository: IServiceProfileAvailabilityRepository) {
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