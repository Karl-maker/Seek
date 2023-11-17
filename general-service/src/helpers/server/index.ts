import { Express } from 'express';
import http, { Server } from 'http';

/**
 * Represents a Node.js server using Express as its application framework.
 */
class NodeServer {
    server: Server;  // The HTTP server instance.
    app: Express;    // The Express application instance.

    /**
     * Creates a new NodeServer instance.
     *
     * @param app - The Express application to be used with the server.
     */
    constructor(app: Express) {
        this.app = app;
        this.server = http.createServer(app);
    }

    /**
     * Starts the server on the specified port.
     *
     * @param port - The port on which the server should listen.
     * @param callback - A function to be called once the server is running.
     */
    start(port: number, callback: Function): void {
        this.server.listen(port, () => {
            callback();
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

export default NodeServer;
