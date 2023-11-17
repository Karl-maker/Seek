import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";
import { IService, IServiceRepository } from "..";

const serviceSchema = new Schema<IService>({
    id: { type: String },
    service_profile_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    cost: { 
        amount: { type: Number, required: true },
        unit: { type: String, required: true, default: 'unit' },
        currency: { type: String, required: true, default: 'TTD' }
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

serviceSchema.pre<IService>('save', function (next) {
    // Copy the value of 'id' to '_id' before saving
    this.id = this["_id"].toHexString();
    next();
});

export class MongoServiceRepository implements IServiceRepository {
    database: IMongoDB;
    model: Model<IService>;

    constructor(db: IMongoDB) {
        this.database = db;     
        this.model = this.database.mongoose.model<IService>('Service', serviceSchema);
    }
    async create(data: Partial<IService>): Promise<IRepositoryCreateResponse<IService>> {
        const service = await this.model.create({
            ...data
        });

        return service.toObject()
    }
    async updateById(id: string | number, data: Partial<IService>): Promise<IRepositoryUpdateByIdResponse<IService>> {

        const service = await this.model.findByIdAndUpdate(id,{
            ...data
        });

        if(!service) {
            return {
                success: false
            }
        }

        return {
            success: true,
            element: service
        };
    }
    async updateOne(where: Partial<IService>, data: Partial<IService>): Promise<IRepositoryUpdateOneResponse<IService>> {

        const service = await this.model.findOneAndUpdate(where,{
            ...data
        });

        if(!service) {
            return {
                success: false
            }
        }

        return {
            success: true,
            element: service
        };
    }
    async updateMany(where: Partial<IService>, data: Partial<IService>): Promise<IRepositoryUpdateManyResponse> {
        const service = await this.model.updateMany({
            ...where
        },{
            ...data
        });

        return {
            mutated:{
                amount: service.modifiedCount
            }
        };
    }
    async findById(id: string | number): Promise<Partial<IService>> {
        const service = await this.model.findById(id);
        return service;
    }
    async findMany(where: Partial<IService>, options?: IFindManyOptions<IService>): Promise<IFindManyResponse<IService>> {
        const query = this.model.find(where);
      
        if (options) {
          if (options.sort) {
            const { field, direction } = options.sort;
            if (field) {
              // Ensure 'field' is a valid key of type IAccount
              if (Object.keys(serviceSchema.paths).includes(field as string)) {
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
    async findOne(where: Partial<IService>): Promise<Partial<IService>> {
        const service = await this.model.findOne({
            ...where
        });

        return service;
    }
    async deleteById(id: string | number): Promise<IDeleteById<IService>> {
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
    async deleteMany(where: Partial<IService>): Promise<IDeleteMany> {
        const deletes = await this.model.deleteMany({
            ...where
        });

        return {
            amount: deletes.deletedCount
        }
    }


}