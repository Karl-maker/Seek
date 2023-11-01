import {
    IAccount,
    IAccountRepository,
} from '..';

import {
    IRepositoryCreateResponse,
    IRepositoryUpdateByIdResponse,
    IRepositoryUpdateManyResponse,
    IFindManyOptions,
    IFindManyResponse,
    IDeleteById,
    IDeleteMany,
} from "../../base-repository"
  
// Mock data store (simulates the database)
const mockData: IAccount[] = [];
  
export class MockAccountRepository implements IAccountRepository {

    create(data: Partial<IAccount>): Promise<IRepositoryCreateResponse<IAccount>> {
      if(!data.password) throw 'Password must be included';

      // Simulate creating a new account
      const newAccount: IAccount = {
        id: (mockData.length + 1).toString(),
        version: 1,
        created_at: new Date(),
        updated_at: new Date(),
        password: data.password,
        ...data,
      };
      mockData.push(newAccount);
  
      return Promise.resolve({ element: newAccount });
    }
  
    updateById(
      id: string | number,
      data: Partial<IAccount>
    ): Promise<IRepositoryUpdateByIdResponse<IAccount>> {
      const accountToUpdate = mockData.find((account) => account.id === id.toString());
      if (accountToUpdate) {
        // Simulate updating an account
        Object.assign(accountToUpdate, data);
        accountToUpdate.updated_at = new Date();
        return Promise.resolve({ 
            success: true,
            element: accountToUpdate
         });
      } else {
        return Promise.resolve({ success: false });
      }
    }
  
    updateMany(
      where: Partial<IAccount>,
      data: Partial<IAccount>
    ): Promise<IRepositoryUpdateManyResponse> {
      // Simulate updating multiple accounts (not implemented)
      return Promise.resolve({ mutated: { amount: 0 } });
    }
  
    findById(id: string | number): Promise<Partial<IAccount>> {
      const account = mockData.find((a) => a.id === id.toString());
      return Promise.resolve(account || null);
    }
  
    findMany(
      where: Partial<IAccount>,
      options?: IFindManyOptions
    ): Promise<IFindManyResponse<IAccount>> {
      // Simulate finding multiple accounts based on the query (not implemented)
      return Promise.resolve({ elements: [], amount: 0 });
    }
  
    findOne(where: Partial<IAccount>): Promise<Partial<IAccount>> {
      // Simulate finding a single account based on the query (not implemented)
      return Promise.resolve(null);
    }
  
    deleteById(id: string | number): Promise<IDeleteById<IAccount>> {
      const index = mockData.findIndex((account) => account.id === id.toString());
      if (index !== -1) {
        const deletedElement = mockData.splice(index, 1)[0];
        return Promise.resolve({ success: true, deletedElement });
      } else {
        return Promise.resolve({ success: false });
      }
    }
  
    deleteMany(where: Partial<IAccount>): Promise<IDeleteMany> {
      // Simulate deleting multiple accounts based on the query (not implemented)
      return Promise.resolve({ amount: 0 });
    }
}
  