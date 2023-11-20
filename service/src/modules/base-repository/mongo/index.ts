import IBaseRepository, { IBase, IDeleteById, IDeleteMany, IFindManyOptions, IFindManyResponse, IRepositoryCreateResponse, IRepositoryUpdateByIdResponse, IRepositoryUpdateManyResponse, IRepositoryUpdateOneResponse } from "..";

export abstract class MongoBaseRepository<T extends IBase> implements IBaseRepository<T> {
    create(data: Partial<T>): Promise<IRepositoryCreateResponse<T>> {
        throw new Error("Method not implemented.");
    }
    updateById(id: string, data: Partial<T>): Promise<IRepositoryUpdateByIdResponse<T>> {
        throw new Error("Method not implemented.");
    }
    updateOne(where: Partial<T>, data: Partial<T>): Promise<IRepositoryUpdateOneResponse<T>> {
        throw new Error("Method not implemented.");
    }
    updateMany(where: Partial<T>, data: Partial<T>): Promise<IRepositoryUpdateManyResponse> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Partial<T>> {
        throw new Error("Method not implemented.");
    }
    findMany(where: Partial<T>, options?: IFindManyOptions<T>): Promise<IFindManyResponse<T>> {
        throw new Error("Method not implemented.");
    }
    findOne(where: Partial<T>): Promise<Partial<T>> {
        throw new Error("Method not implemented.");
    }
    deleteById(id: string): Promise<IDeleteById<T>> {
        throw new Error("Method not implemented.");
    }
    deleteMany(where: Partial<T>): Promise<IDeleteMany> {
        throw new Error("Method not implemented.");
    }
}