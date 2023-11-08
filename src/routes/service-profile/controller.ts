import { NextFunction, Request, Response } from 'express';
import IMessengerQueue from '../../helpers/event';
import { IAccountRepository } from '../../modules/account-repository';
import { IServiceProfileRepository } from '../../modules/service-profile-repository';
import HTTPError from '../../utils/error';
import { IServiceProfileCreatePayload, IServiceProfileUpdatePayload, IServiceProfileUploadedPicturePayload, ServiceProfileTopics } from '../../events/service-profile';
import { IBucketStorage } from '../../helpers/bucket';

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
                    ...req.body,
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
    uploadProfilePicture(storage: IBucketStorage, serviceProfileRepository: IServiceProfileRepository) {
        return async (res: Response, req: Request, next: NextFunction) => {
            try {
                const account_id = req['user'].id;
                const service = await serviceProfileRepository.findById(account_id);

                storage.save(req['file'].filename, async (url: string, error?: Error) => {
                    if(error) throw new HTTPError(error.message, 500);
                    await serviceProfileRepository.updateById(service._id, {
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
        return async (res: Response, req: Request, next: NextFunction) => {
            try {
                const account_id = req['user'].id;
                const service = await serviceProfileRepository.findById(account_id);

                storage.delete(service.picture, async (success: boolean, error?: Error) => {
                    if(error) throw new HTTPError(error.message, 500);
                    if(!success) throw new HTTPError('Issue removing', 500);

                    await serviceProfileRepository.updateById(service._id, {
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

                const found = await serviceProfileRepository.findOne({
                    account_id
                });

                if(!found) {
                    throw new HTTPError(`Service Profile Already Made`, 401);
                }

                const service = await serviceProfileRepository.updateById(found._id, {
                    ...data,
                });

                const payload: IServiceProfileUpdatePayload = {
                    service_profile: {
                        _id: service.element._id,
                        id: service.element._id,
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
        return async (res: Response, req: Request, next: NextFunction) => {
            try {
                const service = await serviceProfileRepository.deleteById(req.params.service_profile_id);
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

}