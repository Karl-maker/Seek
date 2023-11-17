// routes/apiV1.js
import accountRoutes from './account';
import serviceProfileRoutes from './service-profile';
import serviceRoutes from './service';
import ratingServiceProfileRoutes from './rating-service-profile';
import availabilityServiceProfileRoutes from './service-profile-availability';
import locationRoutes from './location';
import IServer from '../helpers/server';
import { IMongoDB } from '../helpers/database/mongo';
import IMessengerQueue from '../helpers/event';

export const apiV1Router = (server: IServer, database: IMongoDB, event: IMessengerQueue) => {
    accountRoutes(server, database, event);
    serviceProfileRoutes(server, database, event);
    serviceRoutes(server, database, event);
    ratingServiceProfileRoutes(server, database, event);
    availabilityServiceProfileRoutes(server, database, event);
    locationRoutes(server, database, event);
    return server.router;
}
