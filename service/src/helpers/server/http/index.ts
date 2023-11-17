import express, { Express, Router } from 'express';
import http, { Server } from 'http';
import IServer from '..';

/**
 * Represents a Node.js server using Express as its application framework.
 */
class HttpServer implements IServer {
    server: Server;  // The HTTP server instance.
    app: Express;    // The Express application instance.
    router: Router;

    /**
     * Creates a new NodeServer instance.
     *
     * @param app - The Express application to be used with the server.
     */
    constructor(app: Express) {
        this.app = app;
        this.server = http.createServer(app);
        this.router = express.Router();
    }

    /**
     * Starts the server on the specified port.
     *
     * @param port - The port on which the server should listen.
     * @param callback - A function to be called once the server is running.
     */
    start(host: string, port: number, callback: (host: string, port: number) => void): void {
        this.server.listen(port, host, () => {
            callback(host, port);
        });
    }

    /**
     * Stops the server and calls the provided callback with an optional error.
     *
     * @param callback - A function to be called after the server is stopped.
     *                  It receives an optional error parameter in case of an error.
     */
    stop(callback: (error?: Error) => void): void {
        this.server.close((error) => {
            callback(error);
        });
    }
}

export default HttpServer;
