import { IAccount, IAccountRepository } from "..";
import { IMongoDB } from "../../../helpers/database/mongo";
import { Model, Schema } from 'mongoose';
import PasswordUtils from "../../../utils/password";
import { IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IFindManyOptions, IFindManyResponse, IDeleteById, IDeleteMany, IRepositoryUpdateOneResponse } from "../../base-repository";
import { logger } from "../../../helpers/logger/basic-logging";
import { MongoBaseRepository } from "../../base-repository/mongo";

const accountSchema = new Schema<IAccount>({
    id: { type: String },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
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
        validate: {
            validator: async function (value: string) {

                if(!value) return true;

                const existingAccount = await this.constructor.findOne({
                    mobile: value
                });
                return !existingAccount;
            },
            message: "Mobile number is already in use",
        },
    },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    status: { type: String, default: 'active' },
    confirmed: { type: Boolean, default: false }
  }, {
    timestamps: { 
        updatedAt: 'updated_at', 
        createdAt: 'created_at' 
    },
    versionKey: 'version',
});

accountSchema.pre<IAccount>('save', function (next) {
    // Copy the value of 'id' to '_id' before saving
    this.id = this["_id"].toHexString();
    next();
});

export class MongoAccountRepository extends MongoBaseRepository<IAccount> {

    constructor(db: IMongoDB) {
        super(db, "Account", accountSchema)
    }

    async create(data: Partial<IAccount>): Promise<IRepositoryCreateResponse<IAccount>> {
        if(data.password) data.password = await PasswordUtils.hash(data.password);
        const createdAccount = await this.model.create(data);
        delete createdAccount.toObject().password;
        return { element: createdAccount.toObject() };
    }

    async updateById(id: string | number, data: Partial<IAccount | null>): Promise<IRepositoryUpdateByIdResponse<IAccount>> {
        if(data.password) data.password = await PasswordUtils.hash(data.password);

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

    async deleteMany(where: Partial<IAccount>): Promise<IDeleteMany> {
        const result = await this.model.updateMany(where, {
            status: 'deleted'
        });
        return { amount: result.modifiedCount || 0 };
    }
}