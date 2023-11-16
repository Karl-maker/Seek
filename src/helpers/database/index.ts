export default interface IDatabase {
    connect(callback?: () => Promise<void>): Promise<void>;
    disconnect(): Promise<void>;
}