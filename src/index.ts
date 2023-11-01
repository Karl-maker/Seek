import { logger } from "./helpers/logger/basic-logging";
import express from "express";
import NodeServer from "./helpers/server";
import { config } from "./config";
import NodeEvent from "./helpers/event/node";
import IMessengerQueue from "./helpers/event";
import MongoDB from "./helpers/database/mongo";
import IDatabase from "./helpers/database";
import { IBucketStorage } from "./helpers/bucket";
import { FileSystemBucket } from "./helpers/bucket/file-system";

const mongo_db_uri = '';
const server: NodeServer = new NodeServer(express());
const event: IMessengerQueue = NodeEvent;
const database: IDatabase = new MongoDB(mongo_db_uri);
const bucket: IBucketStorage = new FileSystemBucket('../storage');

(async () => {
    await database.connect();
    // Add controllers, events and middlewares here..


    server.start(config.port, () => {
        logger.info(`running on port ${config.port}`);
    });
})();


