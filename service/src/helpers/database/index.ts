export default interface IDatabase {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}