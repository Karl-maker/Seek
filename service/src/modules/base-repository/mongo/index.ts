import IBaseRepository, { IBase, IDeleteById, IDeleteMany, IFindManyOptions, IFindManyResponse, IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IRepositoryUpdateOneResponse } from "..";
import { Model, Schema } from 'mongoose';
import { IMongoDB } from "../../../helpers/database/mongo";

export abstract class MongoBaseRepository<T extends IBase> implements IBaseRepository<T> {
    database: IMongoDB;
    model: Model<T>;
    schema: Schema<T>

    constructor(db: IMongoDB, name: string, schema: Schema<T>) {
        this.database = db;   
        this.schema = schema;  
        this.model = this.database.mongoose.model<T>(name, schema);
    }

    async create(data: Partial<T>): Promise<IRepositoryCreateResponse<T>> {
        const created = await this.model.create(data);
        return { element: created.toObject() };
    }
    async updateById(id: string, data: Partial<T>): Promise<IRepositoryUpdateByIdResponse<T>> {
        const updated = await this.model.findByIdAndUpdate(id, data, { new: true });
        if (!updated) {
          return { 
            success: false,
            element: null
         };
        }
        return { 
            success: true,
            element: updated.toObject() 
        };
    }
    async updateOne(where: Partial<T>, data: Partial<T>): Promise<IRepositoryUpdateOneResponse<T>> {
        const updated = await this.model.updateOne(where, data);
        const item = await this.model.findById(updated.upsertedId)
        return {
            success: true,
            element: item
        }
    }
    async updateMany(where: Partial<T>, data: Partial<T>): Promise<IRepositoryUpdateManyResponse> {
        return { mutated: { amount: (await this.model.updateMany(where, data)).modifiedCount } };
    }
    async findById(id: string): Promise<Partial<T>> {
        return await this.model.findById(id);
    }
    async findMany(where: Partial<T>, options?: IFindManyOptions<T>): Promise<IFindManyResponse<T>> {
        const query = this.model.find(where);
      
        if (options) {
          if (options.sort) {
            const { field, direction } = options.sort;
            if (field) {
              // Ensure 'field' is a valid key of type IAccount
              if (Object.keys(this.schema.paths).includes(field as string)) {
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
      
        const elements = await query;
        const total = await this.model.countDocuments(where); // Get the total count from Mongoose
      
        return { elements, amount: total };
    }
    async findOne(where: Partial<T>): Promise<Partial<T>> {
        return await this.model.findOne(where);
    }
    async deleteById(id: string): Promise<IDeleteById<T>> {
        const deleted = await this.model.findByIdAndDelete(id);
        if (!deleted) {
          return { success: false };
        }
        return { success: true, deletedElement: deleted };
    }
    async deleteMany(where: Partial<T>): Promise<IDeleteMany> {
        const result = await this.model.deleteMany(where);
        return { amount: result.deletedCount || 0 };
    }
}