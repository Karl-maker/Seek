import { IRatingServiceProfile, IRatingServiceProfileRepository } from "..";
import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { MongoBaseRepository } from "../../base-repository/mongo";

const ratingServiceProfileSchema = new Schema<IRatingServiceProfile>({
    id: { type: String },
    rated_by: { 
        account_id: { type: String, required: true }
     },
    service_profile_id: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: false },
  }, {
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    },
    versionKey: 'version',
});

ratingServiceProfileSchema.pre<IRatingServiceProfile>('save', function (next) {
    // Copy the value of 'id' to '_id' before saving
    this.id = this["_id"].toHexString();
    next();
});

export class MongoRatingServiceProfileRepository extends MongoBaseRepository<IRatingServiceProfile> implements IRatingServiceProfileRepository {
    database: IMongoDB;
    model: Model<IRatingServiceProfile>;

    constructor(db: IMongoDB) {
        super(db, "RatingServiceProfile",  ratingServiceProfileSchema)
    }

}