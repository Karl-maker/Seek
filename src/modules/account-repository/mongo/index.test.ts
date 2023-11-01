import { MongoAccountRepository } from '.'; // Import the repository class
import MongoDB, { IMongoDB } from '../../../helpers/database/mongo';
import mongoose from 'mongoose';
import { config } from '../../../config';

describe('MongoAccountRepository', () => {
  let repository: MongoAccountRepository;

  beforeAll(async () => {
    // Create a mock MongoDB instance for testing
    const mockMongoDB: IMongoDB = new MongoDB(config.database.test.uri, {
        dbName: config.database.test.name,
        user: config.database.test.user,
        pass: config.database.test.password, 
        retryWrites: true, 
        w: "majority" 
    });
    await mockMongoDB.connect();

    // Initialize the repository with the mock MongoDB instance
    repository = new MongoAccountRepository(mockMongoDB);
  });

  afterAll(async () => {
    // Disconnect from the database after running the tests
    await repository.database.disconnect();
  });

  describe('create', () => {
    it('should create an account', async () => {
      const accountData = { email: 'test@example.com', mobile: '1234567890', password: 'password' };
      const createdAccount = await repository.create(accountData);
  
      // Create an accountData object without the 'password' field for comparison
      const expectedAccountData = { email: 'test@example.com', mobile: '1234567890' };
  
      expect(createdAccount).toHaveProperty('element');
      expect(createdAccount.element).toMatchObject(expectedAccountData);
    });
  
    it('should create an account without mobile', async () => {
      const accountData = { email: 'test@example.com', password: 'password' };
      const createdAccount = await repository.create(accountData);
  
      // Create an accountData object without the 'password' field for comparison
      const expectedAccountData = { email: 'test@example.com' };
  
      expect(createdAccount).toHaveProperty('element');
      expect(createdAccount.element).toMatchObject(expectedAccountData);
    });
  
    it('should create an account without email', async () => {
      const accountData = { mobile: '1234567890', password: 'password' };
      const createdAccount = await repository.create(accountData);
  
      // Create an accountData object without the 'password' field for comparison
      const expectedAccountData = { mobile: '1234567890' };
  
      expect(createdAccount).toHaveProperty('element');
      expect(createdAccount.element).toMatchObject(expectedAccountData);
    });
  
    it('should not create an account without a required field', async () => {
      const accountData = { email: 'test@example.com' }; // Missing "password"
      try {
        await repository.create(accountData);
        // This line should not be reached, as the create method should throw an error
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  
    it('should not create an account without both email or mobile', async () => {
      const accountData = { password: 'password' }; // Missing "email" & "mobile"
      try {
        await repository.create(accountData);
        // This line should not be reached, as the create method should throw an error
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  
    // Add more test cases to cover different scenarios
  });
  
  describe('updateById', () => {
    let accountId: string;
  
    beforeAll(async () => {
      // Create an account with the necessary fields for testing
      const accountData = {
        email: 'test@example.com',
        mobile: '1234567890',
        password: 'password',
      };
      const createdAccount = await repository.create(accountData);
      accountId = createdAccount.element._id;
    });
  
    it('should update an account by ID', async () => {
      const updatedData = {
        email: 'newemail@example.com',
        mobile: '9876543210',
        password: 'newpassword',
      };
      const updatedAccount = await repository.updateById(accountId, updatedData);
  
      expect(updatedAccount).toHaveProperty('element');
      expect(updatedAccount.element).toMatchObject(updatedData);
    });
  
    it('should not update an account without a required field', async () => {
      const updatedData = {
        email: 'newemail@example.com',
        mobile: '', // Missing "mobile"
        password: 'newpassword',
      };
      try {
        await repository.updateById(accountId, updatedData);
        // This line should not be reached, as the updateById method should throw an error
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  
    it('should not update an account without either email or mobile', async () => {
      const updatedData = {
        mobile: '9876543210',
        password: 'newpassword',
      };
      try {
        await repository.updateById(accountId, updatedData);
        // This line should not be reached, as the updateById method should throw an error
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    
    it('should return null for a non-existent ID', async () => {
      const nonExistentAccountId = new mongoose.Types.ObjectId(); // Create a new ObjectId
      const updatedData = {
        email: 'newemail@example.com',
        mobile: '9876543210',
        password: 'newpassword',
      };
      const updatedAccount = await repository.updateById(String(nonExistentAccountId), updatedData);
    
      expect(updatedAccount.element).toBeNull();
      expect(updatedAccount.success).toBeFalsy();
    });
    
  
    // Add more test cases to cover different scenarios
  });

  // Add similar tests for other methods (updateById, deleteById, etc.)
});
