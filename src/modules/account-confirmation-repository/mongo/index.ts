import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";
import { IAccountConfirmation, IAccountConfirmationRepository } from "..";

const accountConfirmationSchema = new Schema<IAccountConfirmation>({
    account_id: { type: String, required: true },
    method: { type: String, required: false },
    code: { type: String, required: true },
},
{
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    } 
}
);

export class MongoAccountConfirmationRepository implements IAccountConfirmationRepository {
    database: IMongoDB;
    model: Model<IAccountConfirmation>;

    constructor(db: IMongoDB) {
        this.database = db;     
        this.model = this.database.mongoose.model<IAccountConfirmation>('AccountConfirmation', accountConfirmationSchema);
    }
    updateOne(where: Partial<IAccountConfirmation>, data: Partial<IAccountConfirmation>): Promise<IRepositoryUpdateOneResponse<IAccountConfirmation>> {
        throw new Error("Method not implemented.");
    }
    async create(data: Partial<IAccountConfirmation>): Promise<IRepositoryCreateResponse<IAccountConfirmation>> {
        const confirmation = await this.model.create({
            ...data
        });

        return confirmation.toObject()
    }
    async updateById(id: string | number, data: Partial<IAccountConfirmation>): Promise<IRepositoryUpdateByIdResponse<IAccountConfirmation>> {

        const confirmation = await this.model.findByIdAndUpdate(id,{
            ...data
        });

        if(!confirmation) {
            return {
                success: false
            }
        }

        return {
            success: true,
            element: confirmation
        };
    }
    async updateMany(where: Partial<IAccountConfirmation>, data: Partial<IAccountConfirmation>): Promise<IRepositoryUpdateManyResponse> {
        const confirmation = await this.model.updateMany({
            ...where
        },{
            ...data
        });

        return {
            mutated:{
                amount: confirmation.modifiedCount
            }
        };
    }
    async findById(id: string | number): Promise<Partial<IAccountConfirmation>> {
        const confirmation = await this.model.findById(id);
        return confirmation;
    }
    async findMany(where: Partial<IAccountConfirmation>, options?: IFindManyOptions<IAccountConfirmation>): Promise<IFindManyResponse<IAccountConfirmation>> {
        const query = this.model.find(where);
      
        if (options) {
          if (options.sort) {
            const { field, direction } = options.sort;
            if (field) {
              // Ensure 'field' is a valid key of type IAccount
              if (Object.keys(accountConfirmationSchema.paths).includes(field as string)) {
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
    async findOne(where: Partial<IAccountConfirmation>): Promise<Partial<IAccountConfirmation>> {
        const confirmation = await this.model.findOne({
            ...where
        });

        return confirmation;
    }
    async deleteById(id: string | number): Promise<IDeleteById<IAccountConfirmation>> {
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
    async deleteMany(where: Partial<IAccountConfirmation>): Promise<IDeleteMany> {
        const deletes = await this.model.deleteMany({
            ...where
        });

        return {
            amount: deletes.deletedCount
        }
    }


}