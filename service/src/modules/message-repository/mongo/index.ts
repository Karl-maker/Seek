import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";
import IMessageRepository, { IMessage } from "..";

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

export class MongoChatRoomRepository implements IMessageRepository {
    database: IMongoDB;
    model: Model<IMessage>;

    constructor(db: IMongoDB) {
        this.database = db;     
        this.model = this.database.mongoose.model<IMessage>('Message', messageSchema);
    }
    async create(data: Partial<IMessage>): Promise<IRepositoryCreateResponse<IMessage>> {
        const message = await this.model.create({
            ...data
        });

        return message.toObject()
    }
    async updateById(id: string | number, data: Partial<IMessage>): Promise<IRepositoryUpdateByIdResponse<IMessage>> {

        const message = await this.model.findByIdAndUpdate(id,{
            ...data
        });

        if(!message) {
            return {
                success: false
            }
        }

        return {
            success: true,
            element: message
        };
    }
    async updateOne(where: Partial<IMessage>, data: Partial<IMessage>): Promise<IRepositoryUpdateOneResponse<IMessage>> {

        const message = await this.model.findOneAndUpdate(where,{
            ...data
        });

        if(!message) {
            return {
                success: false
            }
        }

        return {
            success: true,
            element: message
        };
    }
    async updateMany(where: Partial<IMessage>, data: Partial<IMessage>): Promise<IRepositoryUpdateManyResponse> {
        const message = await this.model.updateMany({
            ...where
        },{
            ...data
        });

        return {
            mutated:{
                amount: message.modifiedCount
            }
        };
    }
    async findById(id: string | number): Promise<Partial<IMessage>> {
        const message = await this.model.findById(id);
        return message;
    }
    async findMany(where: Partial<IMessage>, options?: IFindManyOptions<IMessage>): Promise<IFindManyResponse<IMessage>> {
        const query = this.model.find(where);
      
        if (options) {
          if (options.sort) {
            const { field, direction } = options.sort;
            if (field) {
              // Ensure 'field' is a valid key of type IAccount
              if (Object.keys(messageSchema.paths).includes(field as string)) {
                query.sort({ [field]: direction });
              }
            }
          }
      
          if (options.page) {
            const { size, number } = options.page;
            if (size && number) {
              query.skip((number - 1) * size).limit(size);
            }
          }
        }
      
        const elements = await query.lean();
        const total = await this.model.countDocuments(where); // Get the total count from Mongoose
      
        return { elements, amount: total };
    }
    async findOne(where: Partial<IMessage>): Promise<Partial<IMessage>> {
        const message = await this.model.findOne({
            ...where
        });

        return message;
    }
    async deleteById(id: string | number): Promise<IDeleteById<IMessage>> {
        const deleted = await this.model.findByIdAndDelete(id);

        if(!deleted) {
            return {
                success: false
            }
        }
        return {
            success: true
        }
    }
    async deleteMany(where: Partial<IMessage>): Promise<IDeleteMany> {
        const deletes = await this.model.deleteMany({
            ...where
        });

        return {
            amount: deletes.deletedCount
        }
    }


}