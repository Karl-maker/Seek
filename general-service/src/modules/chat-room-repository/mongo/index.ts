import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";
import IChatRoomRepository, { IChatRoom } from "..";

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

export class MongoChatRoomRepository implements IChatRoomRepository {
    database: IMongoDB;
    model: Model<IChatRoom>;

    constructor(db: IMongoDB) {
        this.database = db;     
        this.model = this.database.mongoose.model<IChatRoom>('Chat Room', chatRoomSchema);
    }
    async create(data: Partial<IChatRoom>): Promise<IRepositoryCreateResponse<IChatRoom>> {
        const chat = await this.model.create({
            ...data
        });

        return chat.toObject()
    }
    async updateById(id: string | number, data: Partial<IChatRoom>): Promise<IRepositoryUpdateByIdResponse<IChatRoom>> {

        const chat = await this.model.findByIdAndUpdate(id,{
            ...data
        });

        if(!chat) {
            return {
                success: false
            }
        }

        return {
            success: true,
            element: chat
        };
    }
    async updateOne(where: Partial<IChatRoom>, data: Partial<IChatRoom>): Promise<IRepositoryUpdateOneResponse<IChatRoom>> {

        const chat = await this.model.findOneAndUpdate(where,{
            ...data
        });

        if(!chat) {
            return {
                success: false
            }
        }

        return {
            success: true,
            element: chat
        };
    }
    async updateMany(where: Partial<IChatRoom>, data: Partial<IChatRoom>): Promise<IRepositoryUpdateManyResponse> {
        const chat = await this.model.updateMany({
            ...where
        },{
            ...data
        });

        return {
            mutated:{
                amount: chat.modifiedCount
            }
        };
    }
    async findById(id: string | number): Promise<Partial<IChatRoom>> {
        const chat = await this.model.findById(id);
        return chat;
    }
    async findMany(where: Partial<IChatRoom>, options?: IFindManyOptions<IChatRoom>): Promise<IFindManyResponse<IChatRoom>> {
        const query = this.model.find(where);
      
        if (options) {
          if (options.sort) {
            const { field, direction } = options.sort;
            if (field) {
              // Ensure 'field' is a valid key of type IAccount
              if (Object.keys(chatRoomSchema.paths).includes(field as string)) {
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
    async findOne(where: Partial<IChatRoom>): Promise<Partial<IChatRoom>> {
        const chat = await this.model.findOne({
            ...where
        });

        return chat;
    }
    async deleteById(id: string | number): Promise<IDeleteById<IChatRoom>> {
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
    async deleteMany(where: Partial<IChatRoom>): Promise<IDeleteMany> {
        const deletes = await this.model.deleteMany({
            ...where
        });

        return {
            amount: deletes.deletedCount
        }
    }


}