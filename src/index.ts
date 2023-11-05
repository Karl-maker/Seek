import { logger } from "./helpers/logger/basic-logging";
import express from "express";
import NodeServer from "./helpers/server";
import { engine } from 'express-handlebars';
import { config } from "./config";
import NodeEvent from "./helpers/event/node";
import IMessengerQueue from "./helpers/event";
import MongoDB, { IMongoDB } from "./helpers/database/mongo";
import { IBucketStorage } from "./helpers/bucket";
import { FileSystemBucket } from "./helpers/bucket/file-system";
import accountRoutes from "./routes/account";

const mongo_db_uri = config.database[config.environment].uri;
const server: NodeServer = new NodeServer(express());
const event: IMessengerQueue = NodeEvent;
const database: IMongoDB = new MongoDB(mongo_db_uri, {
    dbName: config.database[config.environment].name,
    user: config.database[config.environment].user,
    pass: config.database[config.environment].password, 
    retryWrites: true, 
    w: "majority" 
});
const bucket: IBucketStorage = new FileSystemBucket('../storage');

(async () => {
    await database.connect();
    // Add controllers, events and middlewares here..

    server.app.use(express.json())
    server.app.set('view engine', 'handlebars');
    server.app.engine('.handlebars', engine({extname: 'handlebars'}));
    
    accountRoutes(server, database, event);

    server.start(config.port, () => {
        logger.info(`running on port ${config.port}`);
    });
})();


