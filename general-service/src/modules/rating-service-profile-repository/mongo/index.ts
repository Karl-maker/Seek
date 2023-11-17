import { IRatingServiceProfile, IRatingServiceProfileRepository } from "..";
import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";

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

export class MongoRatingServiceProfileRepository implements IRatingServiceProfileRepository {
    database: IMongoDB;
    model: Model<IRatingServiceProfile>;

    constructor(db: IMongoDB) {
        this.database = db;     
        this.model = this.database.mongoose.model<IRatingServiceProfile>('RatingServiceProfile', ratingServiceProfileSchema);
    }
    async create(data: Partial<IRatingServiceProfile>): Promise<IRepositoryCreateResponse<IRatingServiceProfile>> {
        if(!this.checkIfInRange(data.rating)) throw new Error('Rating not in range 0 - 1');
        const rating = await this.model.create(data);
        return {
            element: rating
        }
    }
    async updateById(id: string | number, data: Partial<IRatingServiceProfile>): Promise<IRepositoryUpdateByIdResponse<IRatingServiceProfile>> {
        if(data.rating) {
            if(!this.checkIfInRange(data.rating)) throw new Error('Rating not in range 0 - 1')
        }
        const service = await this.model.findByIdAndUpdate(id, data);
        return {
            success: true,
            element: service
        }
    }
    async updateOne(where: Partial<IRatingServiceProfile>, data: Partial<IRatingServiceProfile>): Promise<IRepositoryUpdateOneResponse<IRatingServiceProfile>> {
        if(data.rating) {
            if(!this.checkIfInRange(data.rating)) throw new Error('Rating not in range 0 - 1')
        }

        const updated_element = await this.model.updateOne({
            ...where
        }, {
            ...data
        });

        return {
            success: true
        }
    }
    async updateMany(where: Partial<IRatingServiceProfile>, data: Partial<IRatingServiceProfile>): Promise<IRepositoryUpdateManyResponse> {
        if(data.rating) {
            if(!this.checkIfInRange(data.rating)) throw new Error('Rating not in range 0 - 1')
        }

        const result = await this.model.updateMany(where, data);
        return {
            mutated:{
                amount: result.modifiedCount
            }
        }

    }
    async findById(id: string | number): Promise<Partial<IRatingServiceProfile>> {
        const service = await this.model.findById(id);
        return service;
    }
    async findMany(where: Partial<IRatingServiceProfile>, options?: IFindManyOptions<IRatingServiceProfile>): Promise<IFindManyResponse<IRatingServiceProfile>>{
        const query = this.model.find(where);
      
        if (options) {
          if (options.sort) {
            const { field, direction } = options.sort;
            if (field) {
              // Ensure 'field' is a valid key of type IAccount
              if (Object.keys(ratingServiceProfileSchema.paths).includes(field as string)) {
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
    async findOne(where: Partial<IRatingServiceProfile>): Promise<Partial<IRatingServiceProfile>> {
        const service = await this.model.findOne(where);
        return service;
    }
    async deleteById(id: string | number): Promise<IDeleteById<IRatingServiceProfile>> {
        const result = await this.model.findByIdAndRemove(id);
        return {
            success: true,
            deletedElement: result
        }
    }
    async deleteMany(where: Partial<IRatingServiceProfile>): Promise<IDeleteMany> {
        const result = await this.model.deleteMany(where);
        return {
            amount: result.deletedCount
        }
    }
    checkIfInRange(value: number): boolean {
        if(value > 1 || value < 0) return false;
        return true;
    }

}