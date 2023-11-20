import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import IMessageRepository, { IMessage } from "..";
import { MongoBaseRepository } from "../../base-repository/mongo";

const messageSchema = new Schema<IMessage>({
    id: { type: String },
    from: { type: String, required: true },
    text: { type: String, required: true },
    chat_room_id: { type: String, required: true }
},
{
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    },
    versionKey: 'version',
}
);

messageSchema.pre<IMessage>('save', function (next) {
    // Copy the value of 'id' to '_id' before saving
    this.id = this["_id"].toHexString();
    next();
});

export class MongoChatRoomRepository extends MongoBaseRepository<IMessage> implements IMessageRepository {
    database: IMongoDB;
    model: Model<IMessage>;

    constructor(db: IMongoDB) {
        super(db, "Message", messageSchema)
    }

}