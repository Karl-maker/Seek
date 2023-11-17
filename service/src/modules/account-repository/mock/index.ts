import {
    IRepositoryCreateResponse,
    IRepositoryUpdateByIdResponse,
    IRepositoryUpdateOneResponse,
    IRepositoryUpdateManyResponse,
    IFindManyResponse,
    IFindManyOptions,
    IDeleteById,
    IDeleteMany,
  } from '../../base-repository';
  import { IAccountRepository, IAccount } from "../";

  export class MockAccountRepository implements IAccountRepository {
    private data: Record<string, IAccount> = {};
    private idCounter: number = 1;
  
    private generateId(): string {
      return String(this.idCounter++);
    }
  
    private getCurrentDate(): Date {
      return new Date();
    }

    constructor() {

    }
  
    async create(data: Partial<IAccount>): Promise<IRepositoryCreateResponse<IAccount>> {
      const id = this.generateId();
      const element = {
        ...(data as IAccount),
        id,
        version: 1,
        created_at: this.getCurrentDate(),
        updated_at: this.getCurrentDate(),
      };
      this.data[id] = element;
      return { element };
    }
  
    async updateById(
      id: string | number,
      data: Partial<IAccount>
    ): Promise<IRepositoryUpdateByIdResponse<IAccount>> {
      const existingElement = this.data[String(id)];
      if (!existingElement) {
        return { success: false };
      }
  
      const updatedElement = {
        ...existingElement,
        ...(data as IAccount),
        updated_at: this.getCurrentDate(),
      };
  
      this.data[String(id)] = updatedElement;
  
      return { element: updatedElement, success: true };
    }
  
    async updateOne(
      where: Partial<IAccount>,
      data: Partial<IAccount>
    ): Promise<IRepositoryUpdateOneResponse<IAccount>> {
      const idToUpdate = Object.keys(this.data).find((id) =>
        Object.entries(where).every(([key, value]) => this.data[id][key] === value)
      );
  
      if (!idToUpdate) {
        return { success: false };
      }
  
      return this.updateById(idToUpdate, data);
    }
  
    async updateMany(
      where: Partial<IAccount>,
      data: Partial<IAccount>
    ): Promise<IRepositoryUpdateManyResponse> {
      const idsToUpdate = Object.keys(this.data).filter((id) =>
        Object.entries(where).every(([key, value]) => this.data[id][key] === value)
      );
  
      const mutatedAmount = idsToUpdate.length;
  
      idsToUpdate.forEach((id) => {
        this.updateById(id, data);
      });
  
      return { mutated: { amount: mutatedAmount } };
    }
  
    async findById(id: string | number): Promise<Partial<IAccount>> {
      return this.data[String(id)];
    }
  
    async findMany(
      where: Partial<IAccount>,
      options?: IFindManyOptions<IAccount>
    ): Promise<IFindManyResponse<IAccount>> {
      const filteredElements = Object.values(this.data).filter((element) =>
        Object.entries(where).every(([key, value]) => element[key] === value)
      );
  
      if (options && options.sort) {
        const { field, direction } = options.sort;
        filteredElements.sort((a, b) => {
          const aValue = a[field];
          const bValue = b[field];
  
          if (aValue === bValue) {
            return 0;
          }
  
          if (direction === 'asc') {
            return aValue < bValue ? -1 : 1;
          } else {
            return aValue > bValue ? -1 : 1;
          }
        });
      }
  
      const page =
        options && options.page
          ? {
              size: options.page.size,
              number: options.page.number,
            }
          : undefined;
  
      const start = page ? page.size * (page.number - 1) : 0;
      const end = page ? start + page.size : filteredElements.length;
  
      const paginatedElements = filteredElements.slice(start, end);
  
      return {
        elements: paginatedElements,
        amount: filteredElements.length,
      };
    }
  
    async findOne(where: Partial<IAccount>): Promise<Partial<IAccount>> {
      const result = await this.findMany(where);
      return result.elements[0];
    }
  
    async deleteById(id: string | number): Promise<IDeleteById<IAccount>> {
      const elementToDelete = this.data[String(id)];
      if (!elementToDelete) {
        return { success: false };
      }
  
      delete this.data[String(id)];
  
      return { success: true, deletedElement: elementToDelete };
    }
  
    async deleteMany(where: Partial<IAccount>): Promise<IDeleteMany> {
      const idsToDelete = Object.keys(this.data).filter((id) =>
        Object.entries(where).every(([key, value]) => this.data[id][key] === value)
      );
  
      const deletedAmount = idsToDelete.length;
  
      idsToDelete.forEach((id) => {
        delete this.data[id];
      });
  
      return { amount: deletedAmount };
    }
  }
  
  