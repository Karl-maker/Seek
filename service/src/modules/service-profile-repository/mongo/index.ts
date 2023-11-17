import { IServiceProfile, IServiceProfileRepository } from "..";
import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";

const serviceProfileSchema = new Schema<IServiceProfile>({
    id: { type: String },
    profession: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    picture: { type: String, required: false },
    verified: { type: Boolean, default: false },
    account_id: { type: String, required: false },
    location: {
        country: { type: String, required: true },
        state: { type: String, required: false },
        areas: [
            { type: String }
        ]
    }
  }, {
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    },
    versionKey: 'version',
});

serviceProfileSchema.pre<IServiceProfile>('save', function (next) {
    // Copy the value of 'id' to '_id' before saving
    this.id = this["_id"].toHexString();
    next();
});

export class MongoServiceProfileRepository implements IServiceProfileRepository {
    database: IMongoDB;
    model: Model<IServiceProfile>;

    constructor(db: IMongoDB) {
        this.database = db;     
        this.model = this.database.mongoose.model<IServiceProfile>('ServiceProfile', serviceProfileSchema);
    }
    async findManyByArea(location: { country: string; area: string; state?: string; }, options?: IFindManyOptions<IServiceProfile>): Promise<IFindManyResponse<IServiceProfile>> {
        const query = this.model.find({
            'location.areas': location.area,
            'location.country': location.country
        });

        if (options) {
            if (options.sort) {
                const { field, direction } = options.sort;
                if (field) {
                    // Ensure 'field' is a valid key of type IAccount
                    if (Object.keys(serviceProfileSchema.paths).includes(field as string)) {
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
        const total = await this.model.countDocuments({
            'location.areas': location.area,
            'location.country': location.country
        });

        return { elements, amount: total };
    }
    async updateOne(where: Partial<IServiceProfile>, data: Partial<IServiceProfile>): Promise<IRepositoryUpdateOneResponse<IServiceProfile>> {
        const updated = await this.model.updateOne({
            ...where
        }, {
            ...data
        });

        return {
            success: true,
        }
    }
    async create(data: Partial<IServiceProfile>): Promise<IRepositoryCreateResponse<IServiceProfile>> {
        const service = await this.model.create(data);
        return {
            element: service
        }
    }
    async updateById(id: string | number, data: Partial<IServiceProfile>): Promise<IRepositoryUpdateByIdResponse<IServiceProfile>> {
        const service = await this.model.findByIdAndUpdate(id, data);
        return {
            success: true,
            element: service
        }
    }
    async updateMany(where: Partial<IServiceProfile>, data: Partial<IServiceProfile>): Promise<IRepositoryUpdateManyResponse> {
        const result = await this.model.updateMany(where, data);
        return {
            mutated:{
                amount: result.modifiedCount
            }
        }

    }
    async findById(id: string | number): Promise<Partial<IServiceProfile>> {
        const service = await this.model.findById(id);
        return service;
    }
    async findMany(where: Partial<IServiceProfile>, options?: IFindManyOptions<IServiceProfile>): Promise<IFindManyResponse<IServiceProfile>>{
        const query = this.model.find(where);
      
        if (options) {
          if (options.sort) {
            const { field, direction } = options.sort;
            if (field) {
              // Ensure 'field' is a valid key of type IAccount
              if (Object.keys(serviceProfileSchema.paths).includes(field as string)) {
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
    async findOne(where: Partial<IServiceProfile>): Promise<Partial<IServiceProfile>> {
        const service = await this.model.findOne(where);
        return service;
    }
    async deleteById(id: string | number): Promise<IDeleteById<IServiceProfile>> {
        const result = await this.model.findByIdAndRemove(id);
        return {
            success: true,
            deletedElement: result
        }
    }
    async deleteMany(where: Partial<IServiceProfile>): Promise<IDeleteMany> {
        const result = await this.model.deleteMany(where);
        return {
            amount: result.deletedCount
        }
    }

}