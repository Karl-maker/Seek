import { ILogin, ILoginRepository } from "..";
import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";

const loginSchema = new Schema<ILogin>({
    account_id: { type: String, required: true },
    method: { type: String, required: true },
    ip_address: { type: String, required: false },
    location: { type: String, required: false },
    device: { type: String, required: false },
},
{
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    } 
}
);

export class MongoLoginRepository implements ILoginRepository {
    database: IMongoDB;
    model: Model<ILogin>;

    constructor(db: IMongoDB) {
        this.database = db;     
        this.model = this.database.mongoose.model<ILogin>('Login', loginSchema);
    }
    updateOne(where: Partial<ILogin>, data: Partial<ILogin>): Promise<IRepositoryUpdateOneResponse<ILogin>> {
        throw new Error("Method not implemented.");
    }
    async create(data: Partial<ILogin>): Promise<IRepositoryCreateResponse<ILogin>> {
        const loginDetails = await this.model.create({
            ...data
        });

        return { element: loginDetails.toObject() }
    }
    async updateById(id: string | number, data: Partial<ILogin>): Promise<IRepositoryUpdateByIdResponse<ILogin>> {

        const updatedLoginDetail = await this.model.findByIdAndUpdate(id,{
            ...data
        });

        if(!updatedLoginDetail) {
            return {
                success: false
            }
        }

        return {
            success: true,
            element: updatedLoginDetail
        };
    }
    async updateMany(where: Partial<ILogin>, data: Partial<ILogin>): Promise<IRepositoryUpdateManyResponse> {
        const updatedLoginDetails = await this.model.updateMany({
            ...where
        },{
            ...data
        });

        return {
            mutated:{
                amount: updatedLoginDetails.modifiedCount
            }
        };
    }
    async findById(id: string | number): Promise<Partial<ILogin>> {
        const loginDetail = await this.model.findById(id);
        return loginDetail;
    }
    async findMany(where: Partial<ILogin>, options?: IFindManyOptions<ILogin>): Promise<IFindManyResponse<ILogin>> {
        const query = this.model.find(where);
      
        if (options) {
          if (options.sort) {
            const { field, direction } = options.sort;
            if (field) {
              // Ensure 'field' is a valid key of type IAccount
              if (Object.keys(loginSchema.paths).includes(field as string)) {
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
    async findOne(where: Partial<ILogin>): Promise<Partial<ILogin>> {
        const loginDetail = await this.model.findOne({
            ...where
        });

        return loginDetail;
    }
    async deleteById(id: string | number): Promise<IDeleteById<ILogin>> {
        const deletedLogin = await this.model.findByIdAndDelete(id);

        if(!deletedLogin) {
            return {
                success: false
            }
        }
        return {
            success: true
        }
    }
    async deleteMany(where: Partial<ILogin>): Promise<IDeleteMany> {
        const deletes = await this.model.deleteMany({
            ...where
        });

        return {
            amount: deletes.deletedCount
        }
    }


}