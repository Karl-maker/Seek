import mongoose, { Connection, Mongoose } from 'mongoose';
import IDatabase from '..';
import { logger } from '../../logger/basic-logging';

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

  async connect(): Promise<void> {
    this.connection = mongoose.connection;
    this.mongoose = mongoose;
    
    mongoose.connect(
      this.uri, 
      this.options
    ).then(async () => {
      logger.info("connected to mongodb");
    }).catch((error) => {
      logger.fatal("issue connecting to mongodb", error);
    });
  }

  async disconnect(): Promise<void> {
    if (this.connection) this.connection.close();
  }
}
