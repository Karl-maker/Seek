export default class HTTPError extends Error {
    status: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.status = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}