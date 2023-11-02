import { IAccount, IAccountRepository } from "..";
import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import PasswordUtils from "../../../utils/password";
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany } from "../../base-repository";

const accountSchema = new Schema<IAccount>({
    email: { 
        type: String, 
        required: false, 
        unique: true,
        validate: {
            validator: async function (value: string) {

                const existingAccount = await this.constructor.findOne({
                    email: value
                });
                return !existingAccount;
            },
            message: "Email is already in use",
        }, 
    },
    mobile: { 
        type: String, 
        required: false, 
        unique: true,
        validate: {
            validator: async function (value: string) {

                const existingAccount = await this.constructor.findOne({
                    mobile: value
                });
                return !existingAccount;
            },
            message: "Mobile number is already in use",
        },
    },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
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
        if(data.password) data.password = await PasswordUtils.hash(data.password);
        const createdAccount = await this.model.create(data);
        delete createdAccount.toObject().password;
        return { element: createdAccount.toObject() };
    }

    async updateById(id: string | number, data: Partial<IAccount | null>): Promise<IRepositoryUpdateByIdResponse<IAccount>> {
        const updatedAccount = await this.model.findByIdAndUpdate(id, data, { new: true });
        if (!updatedAccount) {
          return { 
            success: false,
            element: null
         };
        }
        return { 
            success: true,
            element: updatedAccount.toObject() 
        };
    }

    /**
     * @TODO Test Method
     */
    async updateMany(where: Partial<IAccount>, data: Partial<IAccount>): Promise<IRepositoryUpdateManyResponse> {
        const result = await this.model.updateMany(where, data);
        return { mutated: { amount: result.modifiedCount } };
    }
    
    /**
     * @TODO Test Method
     */
    async findById(id: string | number): Promise<Partial<IAccount>> {
        const account = await this.model.findById(id).lean();
        return account;
    }

    /**
     * @TODO Test Method
     */
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
      
    /**
     * @TODO Test Method
     */
    async findOne(where: Partial<IAccount>): Promise<Partial<IAccount>> {
        const account = await this.model.findOne(where).lean();
        return account;
    }

    /**
     * @TODO Test Method
     */
    async deleteById(id: string | number): Promise<IDeleteById<IAccount>> {
        const deletedAccount = await this.model.findByIdAndDelete(id).lean();
        if (!deletedAccount) {
          return { success: false };
        }
        return { success: true, deletedElement: deletedAccount };
    }

    /**
     * @TODO Test Method
     */
    async deleteMany(where: Partial<IAccount>): Promise<IDeleteMany> {
        const result = await this.model.deleteMany(where);
        return { amount: result.deletedCount || 0 };
    }
}