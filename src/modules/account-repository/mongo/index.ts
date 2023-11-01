import { IAccount, IAccountRepository } from "..";
import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany } from "../../base-repository";

const accountSchema = new Schema<IAccount>({
    email: { type: String, required: false },
    mobile: { type: String, required: false },
    password: { type: String, required: true },
  }, {
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    } 
});

export class MongoAccountRepository implements IAccountRepository {
    database: IMongoDB;
    model: Model<IAccount>;

    constructor(db: IMongoDB) {
        this.database = db;     
        this.model = this.database.mongoose.model<IAccount>('Account', accountSchema);
    }

    async create(data: Partial<IAccount>): Promise<IRepositoryCreateResponse<IAccount>> {
        const createdAccount = await this.model.create(data);
        return { element: createdAccount.toObject() };
    }

    async updateById(id: string | number, data: Partial<IAccount>): Promise<IRepositoryUpdateByIdResponse<IAccount>> {
        const updatedAccount = await this.model.findByIdAndUpdate(id, data, { new: true });
        if (!updatedAccount) {
          return { success: false };
        }
        return { 
            success: true,
            element: updatedAccount.toObject() 
        };
    }

    async updateMany(where: Partial<IAccount>, data: Partial<IAccount>): Promise<IRepositoryUpdateManyResponse> {
        const result = await this.model.updateMany(where, data);
        return { mutated: { amount: result.modifiedCount } };
    }
    
    async findById(id: string | number): Promise<Partial<IAccount>> {
        const account = await this.model.findById(id).lean();
        return account;
    }

    async findMany(
        where: Partial<IAccount>,
        options?: IFindManyOptions<IAccount>
      ): Promise<IFindManyResponse<IAccount>> {
        const query = this.model.find(where);
      
        if (options) {
          if (options.sort) {
            const { field, direction } = options.sort;
            if (field) {
              // Ensure 'field' is a valid key of type IAccount
              if (Object.keys(accountSchema.paths).includes(field as string)) {
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
      

    async findOne(where: Partial<IAccount>): Promise<Partial<IAccount>> {
        const account = await this.model.findOne(where).lean();
        return account;
    }

    async deleteById(id: string | number): Promise<IDeleteById<IAccount>> {
        const deletedAccount = await this.model.findByIdAndDelete(id).lean();
        if (!deletedAccount) {
          return { success: false };
        }
        return { success: true, deletedElement: deletedAccount };
    }

    async deleteMany(where: Partial<IAccount>): Promise<IDeleteMany> {
        const result = await this.model.deleteMany(where);
        return { amount: result.deletedCount || 0 };
    }
}