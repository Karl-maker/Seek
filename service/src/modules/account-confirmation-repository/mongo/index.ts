import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IAccountConfirmation, IAccountConfirmationRepository } from "..";
import { MongoBaseRepository } from "../../base-repository/mongo";

const accountConfirmationSchema = new Schema<IAccountConfirmation>({
    id: { type: String },
    account_id: { type: String, required: true },
    method: { type: String, required: false },
    code: { type: String, required: true },
},
{
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    },
    versionKey: 'version',
}
);

accountConfirmationSchema.pre<IAccountConfirmation>('save', function (next) {
    // Copy the value of 'id' to '_id' before saving
    this.id = this["_id"].toHexString();
    next();
});

export class MongoAccountConfirmationRepository extends MongoBaseRepository<IAccountConfirmation> implements IAccountConfirmationRepository {
    database: IMongoDB;
    model: Model<IAccountConfirmation>;

    constructor(db: IMongoDB) {
        super(db, "AccountConfirmation", accountConfirmationSchema)
    }

}