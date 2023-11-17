import { Express } from 'express';
import { Server } from 'http';

export default interface IServer {
    app: Express;
    server: Server;
    start(host: string, port: number, callback: (host: string, port: number) => void): void;
    stop(callback: (error?: Error) => void): void
}