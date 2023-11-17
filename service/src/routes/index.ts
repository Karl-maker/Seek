// routes/apiV1.js
import homeRoutes from "./web/home"
import accountRoutes from './api/account';
import serviceProfileRoutes from './api/service-profile';
import serviceRoutes from './api/service';
import ratingServiceProfileRoutes from './api/rating-service-profile';
import availabilityServiceProfileRoutes from './api/service-profile-availability';
import locationRoutes from './api/location';
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

export const webViewRouter = (server: IServer, database: IMongoDB, event: IMessengerQueue) => {
    homeRoutes(server, database, event);
    return server.router;
}
