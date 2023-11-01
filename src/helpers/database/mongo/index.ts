import mongoose, { Connection, Mongoose } from 'mongoose';
import IDatabase from '..';

export default class MongoDB implements IDatabase {
  private connection: Connection | null = null;
  private uri: string;
  private options: mongoose.ConnectOptions;
  public mongoose: Mongoose;

  constructor(uri: string, options?: mongoose.ConnectOptions){
    this.uri = uri;
    this.options = options;
  }

  async connect(): Promise<void> {
    this.connection = mongoose.connection;
    await mongoose.connect(this.uri, this.options);
  }

  async disconnect(): Promise<void> {
    if (this.connection) this.connection.close();
  }
}
