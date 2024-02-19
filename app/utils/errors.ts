export class ResponseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ResponseError';
        this.message = message;
    }
}
