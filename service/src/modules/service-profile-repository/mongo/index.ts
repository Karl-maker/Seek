import { IServiceProfile, IServiceProfileRepository } from "..";
import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";
import { MongoBaseRepository } from "../../base-repository/mongo";

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

export class MongoServiceProfileRepository extends MongoBaseRepository<IServiceProfile> implements IServiceProfileRepository {
    database: IMongoDB;
    model: Model<IServiceProfile>;

    constructor(db: IMongoDB) {
        super(db, "ServiceProfile", serviceProfileSchema)
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

}