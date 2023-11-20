import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";
import IServiceProfileAvailabilityRepository, { IServiceProfileAvailability } from "..";
import { MongoBaseRepository } from "../../base-repository/mongo";

const serviceSchema = new Schema<IServiceProfileAvailability>({
    id: { type: String },
    service_profile_id: { type: String, required: true },
    free_slot: {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
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

serviceSchema.pre<IServiceProfileAvailability>('save', function (next) {
    // Copy the value of 'id' to '_id' before saving
    this.id = this["_id"].toHexString();
    next();
});

export class MongoServiceProfileAvailabilityRepository extends MongoBaseRepository<IServiceProfileAvailability> implements IServiceProfileAvailabilityRepository {
    database: IMongoDB;
    model: Model<IServiceProfileAvailability>;

    constructor(db: IMongoDB) {
        super(db, "ServiceProfileAvailability", serviceSchema)
    }

}