import { NextFunction, Request, Response } from 'express';
import IMessengerQueue from '../../../helpers/event';
import ILocationRepository from '../../../modules/location-repository';
import HTTPError from '../../../utils/error';

export default class LocationController {
    event: IMessengerQueue;
    constructor(messengerQueue: IMessengerQueue) {
        this.event = messengerQueue;
    }

    createLocation(locationRepository: ILocationRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const data = req.body;

                const location = await locationRepository.create(data);

                res.json({
                    location: location.element,
                    message: "Location Created"
                });
                
            } catch(err) {
                next(err)
            }
        }
    }
    updateLocationById(locationRepository: ILocationRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const data = req.body;
                const id = req.params.location_id;

                const location = await locationRepository.updateById(id, data);

                if(!location.success) throw new HTTPError('Issue Updating Location', 500);
                
                res.json({
                    location: location.element,
                    message: "Location Updated"
                });
                
            } catch(err) {
                next(err)
            }
        }
    }
    getAllLocations(locationRepository: ILocationRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const {
                    country
                } = req.query;

                const locations = await locationRepository.findMany({
                    country: String(country)   
                })
                
                res.json({
                    locations: locations.elements,
                    count: locations.amount
                });
                
            } catch(err) {
                next(err)
            }
        }
    }
    deleteLocationById(locationRepository: ILocationRepository) {
        return async(req: Request, res: Response, next: NextFunction) => {
            try{
                const id = req.params.location_id;
                const result = await locationRepository.deleteById(id);

                if(!result.success) throw new HTTPError(`Issue Deleting Location`, 500);
                
                res.json({
                    message: "Location Deleted"
                });
                
            } catch(err) {
                next(err)
            }
        }
    }

}