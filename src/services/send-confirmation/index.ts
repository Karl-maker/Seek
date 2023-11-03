export default interface ISendConfirmation<T> {
    send(input: T): Promise<void>;
}