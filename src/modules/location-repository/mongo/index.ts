import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";
import ILocationsRepository, { ILocation } from "..";

const locationSchema = new Schema<ILocation>({
    area: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: false },
},
{
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    } 
}
);

export class MongoLocationRepository implements ILocationsRepository{
    database: IMongoDB;
    model: Model<ILocation>;

    constructor(db: IMongoDB) {
        this.database = db;     
        this.model = this.database.mongoose.model<ILocation>('Location', locationSchema);
    }
    updateOne(where: Partial<ILocation>, data: Partial<ILocation>): Promise<IRepositoryUpdateOneResponse<ILocation>> {
        throw new Error("Method not implemented.");
    }
    async create(data: Partial<ILocation>): Promise<IRepositoryCreateResponse<ILocation>> {
        const location = await this.model.create({
            ...data
        });

        return { element: location.toObject() }
    }
    async updateById(id: string | number, data: Partial<ILocation>): Promise<IRepositoryUpdateByIdResponse<ILocation>> {

        const updatedLocation = await this.model.findByIdAndUpdate(id,{
            ...data
        });

        if(!updatedLocation) {
            return {
                success: false
            }
        }

        return {
            success: true,
            element: updatedLocation
        };
    }
    async updateMany(where: Partial<ILocation>, data: Partial<ILocation>): Promise<IRepositoryUpdateManyResponse> {
        const updatedLocations = await this.model.updateMany({
            ...where
        },{
            ...data
        });

        return {
            mutated:{
                amount: updatedLocations.modifiedCount
            }
        };
    }
    async findById(id: string | number): Promise<Partial<ILocation>> {
        const location = await this.model.findById(id);
        return location;
    }
    async findMany(where: Partial<ILocation>, options?: IFindManyOptions<ILocation>): Promise<IFindManyResponse<ILocation>> {
        const query = this.model.find(where);
      
        if (options) {
          if (options.sort) {
            const { field, direction } = options.sort;
            if (field) {
              // Ensure 'field' is a valid key of type IAccount
              if (Object.keys(locationSchema.paths).includes(field as string)) {
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
    async findOne(where: Partial<ILocation>): Promise<Partial<ILocation>> {
        const locationDetail = await this.model.findOne({
            ...where
        });

        return locationDetail;
    }
    async deleteById(id: string | number): Promise<IDeleteById<ILocation>> {
        const deletedLocation = await this.model.findByIdAndDelete(id);

        if(!deletedLocation) {
            return {
                success: false
            }
        }
        return {
            success: true
        }
    }
    async deleteMany(where: Partial<ILocation>): Promise<IDeleteMany> {
        const deletes = await this.model.deleteMany({
            ...where
        });

        return {
            amount: deletes.deletedCount
        }
    }


}