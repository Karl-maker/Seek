import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";
import IChatRoomRepository, { IChatRoom } from "..";
import { MongoBaseRepository } from "../../base-repository/mongo";

const chatRoomSchema = new Schema<IChatRoom>({
    id: { type: String },
    members: [
        {
            account_id: { type: String, required: true },
            service_profile_id:  { type: String, required: true },
        }
    ],
},
{
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    },
    versionKey: 'version',
}
);

chatRoomSchema.pre<IChatRoom>('save', function (next) {
    // Copy the value of 'id' to '_id' before saving
    this.id = this["_id"].toHexString();
    next();
});

export class MongoChatRoomRepository extends MongoBaseRepository<IChatRoom> implements IChatRoomRepository {
    database: IMongoDB;
    model: Model<IChatRoom>;

    constructor(db: IMongoDB) {
        super(db, "Chat Room", chatRoomSchema)
    }

}