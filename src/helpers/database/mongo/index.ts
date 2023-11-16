import mongoose, { Connection, Mongoose } from 'mongoose';
import IDatabase from '..';

export interface IMongoDB extends IDatabase {
  connection: Connection | null;
  uri: string;
  options: mongoose.ConnectOptions;
  mongoose: Mongoose;
}

export default class MongoDB implements IMongoDB {
  connection: Connection | null = null;
  uri: string;
  options: mongoose.ConnectOptions;
  mongoose: Mongoose;

  constructor(uri: string, options?: mongoose.ConnectOptions){
    this.uri = uri;
    this.options = options;
  }

  async connect(callback?: () => Promise<void>): Promise<void> {
    this.connection = mongoose.connection;
    this.mongoose = mongoose;
    await mongoose.connect(
      this.uri, 
      this.options
    );
    if(callback) await callback();
  }

  async disconnect(): Promise<void> {
    if (this.connection) this.connection.close();
  }
}
