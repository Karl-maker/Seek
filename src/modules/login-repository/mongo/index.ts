import { ILogin, ILoginRepository } from "..";
import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany } from "../../base-repository";

const loginSchema = new Schema<ILogin>({
    account_id: { type: String, required: true },
    is_successful: { type: Boolean, required: true },
    refresh_token: { type: String, required: false },
    method: { type: String, required: true },
    ip_address: { type: String, required: true },
    location: { type: String, required: true },
    device: { type: String, required: true },
},
{
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    } 
}
);

export class MongoAccountRepository implements ILoginRepository {
    database: IMongoDB;
    model: Model<ILogin>;

    constructor(db: IMongoDB) {
        this.database = db;     
        this.model = this.database.mongoose.model<ILogin>('Login', loginSchema);
    }
    create(data: Partial<ILogin>): Promise<IRepositoryCreateResponse<ILogin>> {
        throw new Error("Method not implemented.");
    }
    updateById(id: string | number, data: Partial<ILogin>): Promise<IRepositoryUpdateByIdResponse<ILogin>> {
        throw new Error("Method not implemented.");
    }
    updateMany(where: Partial<ILogin>, data: Partial<ILogin>): Promise<IRepositoryUpdateManyResponse> {
        throw new Error("Method not implemented.");
    }
    findById(id: string | number): Promise<Partial<ILogin>> {
        throw new Error("Method not implemented.");
    }
    findMany(where: Partial<ILogin>, options?: IFindManyOptions<ILogin>): Promise<IFindManyResponse<ILogin>> {
        throw new Error("Method not implemented.");
    }
    findOne(where: Partial<ILogin>): Promise<Partial<ILogin>> {
        throw new Error("Method not implemented.");
    }
    deleteById(id: string | number): Promise<IDeleteById<ILogin>> {
        throw new Error("Method not implemented.");
    }
    deleteMany(where: Partial<ILogin>): Promise<IDeleteMany> {
        throw new Error("Method not implemented.");
    }


}