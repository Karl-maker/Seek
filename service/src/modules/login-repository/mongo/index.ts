import { ILogin, ILoginRepository } from "..";
import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";
import { MongoBaseRepository } from "../../base-repository/mongo";

const loginSchema = new Schema<ILogin>({
    id: { type: String },
    account_id: { type: String, required: true },
    method: { type: String, required: true },
    ip_address: { type: String, required: false },
    medium: { type: String, required: false },
    location: { 
        area: { type: String, required: false },
        state: { type: String, required: false },
        country: { type: String, required: false },
        coordinates: {
            longitude: { type: Number, required: false },
            latitude: { type: Number, required: false }
        }
     },
    device: { type: String, required: false },
    approved: { type: Boolean, default: true },
},
{
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    },
    versionKey: 'version',
}
);

loginSchema.pre<ILogin>('save', function (next) {
    // Copy the value of 'id' to '_id' before saving
    this.id = this["_id"].toHexString();
    next();
});

export class MongoLoginRepository extends MongoBaseRepository<ILogin> implements ILoginRepository {
    database: IMongoDB;
    model: Model<ILogin>;

    constructor(db: IMongoDB) {
        super(db, "Login", loginSchema)
    }

    async findLastByAccountId (account_id: string): Promise<ILogin> {
        const login = await this.model
        .findOne({
            account_id
        })
        .sort({ created_at: -1 }) // Sort in descending order based on createdAt
        .limit(1);

        return login;
    };
}