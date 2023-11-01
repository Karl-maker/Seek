import { MongoAccountRepository } from '.'; // Import the repository class
import MongoDB, { IMongoDB } from '../../../helpers/database/mongo';
import mongoose from 'mongoose';
import { config } from '../../../config';

describe('MongoAccountRepository', () => {
  let repository: MongoAccountRepository;
  let createdAccountId: string;

  beforeAll(async () => {
    // Create a mock MongoDB instance for testing
    const mockMongoDB: IMongoDB = new MongoDB(config.database.test.uri);
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
      const accountData = { email: 'test@example.com', mobile: '1234567890' };
      const createdAccount = await repository.create(accountData);

      expect(createdAccount).toHaveProperty('element');
      expect(createdAccount.element).toMatchObject(accountData);

      // Capture the auto-generated ID for later use
      createdAccountId = createdAccount.element._id;
    });
  });

  describe('findById', () => {
    it('should find an account by ID', async () => {
      if (!createdAccountId) {
        throw new Error('No created account ID available.');
      }

      const foundAccount = await repository.findById(createdAccountId);

      expect(foundAccount).toBeDefined();
      expect(foundAccount._id).toEqual(createdAccountId);
    });

    it('should return null for a non-existent ID', async () => {
      const nonExistentAccountId = 'non-existent-account-id';
      const foundAccount = await repository.findById(nonExistentAccountId);

      expect(foundAccount).toBeNull();
    });
  });

  // Add similar tests for other methods (updateById, deleteById, etc.)
});
