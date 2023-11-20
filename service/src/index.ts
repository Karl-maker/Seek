import { logger } from "./helpers/logger/basic-logging";
import express from "express";
import { engine } from 'express-handlebars';
import { config } from "./config";
import NodeEvent from "./helpers/event/node";
import IMessengerQueue from "./helpers/event";
import MongoDB, { IMongoDB } from "./helpers/database/mongo";
import IServer from "./helpers/server";
import HttpServer from "./helpers/server/http";
import { apiV1Router, webViewRouter } from "./routes";
import errorHandler, { error404 } from "./middlewares/error-handler";
import { ConfigOptions } from "express-handlebars/types";
import path from "path";

const mongo_db_uri: string = config.database[config.environment].uri;
const server: IServer = new HttpServer(express());
const event: IMessengerQueue = NodeEvent;
const handlebarConfig: ConfigOptions = { 
    defaultLayout: 'main', 
    extname: '.handlebars',  // Adjusted the file extension
    partialsDir: path.resolve(__dirname, '../views/partials'),
    layoutsDir: path.resolve(__dirname, '../views/layouts'),
}
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

    server.app.use(express.json());
    server.app.set('view engine', 'handlebars');
    server.app.engine('handlebars', engine(handlebarConfig));
    server.app.set('views', path.resolve(__dirname, '../views'));
    server.app.use(express.static(path.join(__dirname, '../public')));
    server.app.use('/', webViewRouter(server, database, event));
    server.app.use('/api/v1', apiV1Router(server, database, event))
    server.app.use(errorHandler(server, event));
    server.app.use(error404);

    server.start('0.0.0.0', config.port, (host: string, port: number) => {
        logger.info(`running on http://${host}:${port}/`);
    });
})();


