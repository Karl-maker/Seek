import { IAccount, IAccountRepository } from "..";
import MongoDB from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany } from "../../base-repository";

const accountSchema = new Schema<IAccount>({
    email: { type: String, required: false },
    mobile: { type: String, required: false },
  }, {
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    } 
});

export class MongoAccountRepository implements IAccountRepository {
    private database: MongoDB;
    private model: Model<IAccount>;

    constructor(db: MongoDB) {
        this.database = db;     
        this.model = this.database.mongoose.model<IAccount>('Account', accountSchema);
    }

    create(data: Partial<IAccount>): Promise<IRepositoryCreateResponse<IAccount>> {
        throw new Error("Method not implemented.");
    }
    updateById(id: string | number, data: Partial<IAccount>): Promise<IRepositoryUpdateByIdResponse<IAccount>> {
        throw new Error("Method not implemented.");
    }
    updateMany(where: Partial<IAccount>, data: Partial<IAccount>): Promise<IRepositoryUpdateManyResponse> {
        throw new Error("Method not implemented.");
    }
    findById(id: string | number): Promise<Partial<IAccount>> {
        throw new Error("Method not implemented.");
    }
    findMany(where: Partial<IAccount>, options?: IFindManyOptions): Promise<IFindManyResponse<IAccount>> {
        throw new Error("Method not implemented.");
    }
    findOne(where: Partial<IAccount>): Promise<Partial<IAccount>> {
        throw new Error("Method not implemented.");
    }
    deleteById(id: string | number): Promise<IDeleteById<IAccount>> {
        throw new Error("Method not implemented.");
    }
    deleteMany(where: Partial<IAccount>): Promise<IDeleteMany> {
        throw new Error("Method not implemented.");
    }
    
}