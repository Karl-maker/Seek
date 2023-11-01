export default interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<IRepositoryCreateResponse<T>>;
    updateById(id: string | number, data: Partial<T>): Promise<IRepositoryUpdateByIdResponse<T>>;
    updateMany(where: Partial<T>, data: Partial<T>): Promise<IRepositoryUpdateManyResponse>;
    findById(id: string | number): Promise<Partial<T>>;
    findMany(where: Partial<T>, options?: IFindManyOptions): Promise<IFindManyResponse<T>>;
    findOne(where: Partial<T>): Promise<Partial<T>>;
    deleteById(id: string | number): Promise<IDeleteById<T>>;
    deleteMany(where: Partial<T>): Promise<IDeleteMany>;
}

export interface IBase {
    id: string | number;
    version: number;
    created_at: Date;
    updated_at: Date;
}

export interface IDeleteMany {
    amount: number;
}

export interface IDeleteById<T> {
    success: boolean;
    deletedElement?: Partial<T>
}

export interface IRepositoryCreateResponse<T> {
    element: Partial<T>;
}

export interface IRepositoryUpdateByIdResponse<T> {
    element: Partial<T>;
}

export interface IRepositoryUpdateManyResponse {
    mutated: {
        amount: number;
    }
}

export interface IFindManyResponse<T> {
    elements: Partial<T>[];
    amount: number;
}

export enum SortEnum {
    asc = 'asc',
    dsc = 'dsc'
}

export interface IFindManyOptions {
    sort?: SortEnum
}