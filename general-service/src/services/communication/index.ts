export default interface ICommunication<T> {
    send(input: T): Promise<void>;
}   