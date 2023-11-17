import { logger } from "./helpers/logger/basic-logging";
import express from "express";
import { engine } from 'express-handlebars';
import { config } from "./config";
import NodeEvent from "./helpers/event/node";
import IMessengerQueue from "./helpers/event";
import MongoDB, { IMongoDB } from "./helpers/database/mongo";
import accountRoutes from "./routes/account";
import serviceProfileRoutes from "./routes/service-profile";
import serviceRoutes from "./routes/service";
import ratingServiceProfileRoutes from "./routes/rating-service-profile";
import availabilityServiceProfileRoutes from "./routes/service-profile-availability";
import locationRoutes from "./routes/location";
import IServer from "./helpers/server";
import HttpServer from "./helpers/server/http";

const mongo_db_uri: string = config.database[config.environment].uri;
const server: IServer = new HttpServer(express());
const event: IMessengerQueue = NodeEvent;
const database: IMongoDB = new MongoDB(mongo_db_uri, {
    dbName: config.database[config.environment].name,
    user: config.database[config.environment].user,
    pass: config.database[config.environment].password, 
    retryWrites: true, 
    w: "majority" 
});

(async () => {
    await database.connect();
    // Add controllers, events and middlewares here..

    server.app.use(express.json())
    server.app.set('view engine', 'handlebars');
    server.app.engine('.handlebars', engine({extname: 'handlebars'}));
    
    accountRoutes(server, database, event);
    serviceProfileRoutes(server, database, event);
    serviceRoutes(server, database, event);
    ratingServiceProfileRoutes(server, database, event);
    availabilityServiceProfileRoutes(server, database, event);
    locationRoutes(server, database, event);

    server.start('0.0.0.0', config.port, (host: string, port: number) => {
        logger.info(`running on http://${host}:${port}/`);
    });
})();


