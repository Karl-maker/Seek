import { IMongoDB } from "../../../helpers/database/mongo";
import { Schema } from 'mongoose';
import { IService, IServiceRepository } from "..";
import { MongoBaseRepository } from "../../base-repository/mongo";

const serviceSchema = new Schema<IService>({
    id: { type: String },
    service_profile_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    cost: { 
        amount: { type: Number, required: true },
        unit: { type: String, required: true, default: 'unit' },
        currency: { type: String, required: true, default: 'TTD' }
    }
},
{
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    },
    versionKey: 'version', 
}
);

serviceSchema.pre<IService>('save', function (next) {
    // Copy the value of 'id' to '_id' before saving
    this.id = this["_id"].toHexString();
    next();
});

export class MongoServiceRepository extends MongoBaseRepository<IService> implements IServiceRepository {

    constructor(db: IMongoDB) {
        super(db, "Service", serviceSchema)
    }

}