export default interface ISMS {
    send(mobile: string, message: string): Promise<void>;
}