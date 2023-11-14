import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";
import IServiceProfileAvailabilityRepository, { IServiceProfileAvailability } from "..";

const serviceSchema = new Schema<IServiceProfileAvailability>({
    service_profile_id: { type: String, required: true },
    free_slot: {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
    }
},
{
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    } 
}
);

export class MongoServiceProfileAvailabilityRepository implements IServiceProfileAvailabilityRepository {
    database: IMongoDB;
    model: Model<IServiceProfileAvailability>;

    constructor(db: IMongoDB) {
        this.database = db;     
        this.model = this.database.mongoose.model<IServiceProfileAvailability>('Service Profile Availability', serviceSchema);
    }
    async create(data: Partial<IServiceProfileAvailability>): Promise<IRepositoryCreateResponse<IServiceProfileAvailability>> {
        const availability = await this.model.create({
            ...data
        });

        return availability.toObject()
    }
    async updateById(id: string | number, data: Partial<IServiceProfileAvailability>): Promise<IRepositoryUpdateByIdResponse<IServiceProfileAvailability>> {

        const availability = await this.model.findByIdAndUpdate(id,{
            ...data
        });

        if(!availability) {
            return {
                success: false
            }
        }

        return {
            success: true,
            element: availability
        };
    }
    async updateOne(where: Partial<IServiceProfileAvailability>, data: Partial<IServiceProfileAvailability>): Promise<IRepositoryUpdateOneResponse<IServiceProfileAvailability>> {

        const availability = await this.model.findOneAndUpdate(where,{
            ...data
        });

        if(!availability) {
            return {
                success: false
            }
        }

        return {
            success: true,
            element: availability
        };
    }
    async updateMany(where: Partial<IServiceProfileAvailability>, data: Partial<IServiceProfileAvailability>): Promise<IRepositoryUpdateManyResponse> {
        const availability = await this.model.updateMany({
            ...where
        },{
            ...data
        });

        return {
            mutated:{
                amount: availability.modifiedCount
            }
        };
    }
    async findById(id: string | number): Promise<Partial<IServiceProfileAvailability>> {
        const availability = await this.model.findById(id);
        return availability;
    }
    async findMany(where: Partial<IServiceProfileAvailability>, options?: IFindManyOptions<IServiceProfileAvailability>): Promise<IFindManyResponse<IServiceProfileAvailability>> {
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
    async findOne(where: Partial<IServiceProfileAvailability>): Promise<Partial<IServiceProfileAvailability>> {
        const availability = await this.model.findOne({
            ...where
        });

        return availability;
    }
    async deleteById(id: string | number): Promise<IDeleteById<IServiceProfileAvailability>> {
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
    async deleteMany(where: Partial<IServiceProfileAvailability>): Promise<IDeleteMany> {
        const deletes = await this.model.deleteMany({
            ...where
        });

        return {
            amount: deletes.deletedCount
        }
    }


}