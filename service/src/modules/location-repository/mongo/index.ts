import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";
import ILocationRepository, { ILocation } from "..";
import { MongoBaseRepository } from "../../base-repository/mongo";

const locationSchema = new Schema<ILocation>({
    id: { type: String },
    area: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: false },
},
{
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    },
    versionKey: 'version',
}
);

locationSchema.pre<ILocation>('save', function (next) {
    // Copy the value of 'id' to '_id' before saving
    this.id = this["_id"].toHexString();
    next();
});

export class MongoLocationRepository extends MongoBaseRepository<ILocation> implements ILocationRepository{
    database: IMongoDB;
    model: Model<ILocation>;

    constructor(db: IMongoDB) {
        super(db, "Location", locationSchema)
    }
}