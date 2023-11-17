import { MongoAccountRepository } from '.'; // Import the repository class
import MongoDB, { IMongoDB } from '../../../helpers/database/mongo';
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

  // Add similar tests for other methods (updateById, deleteById, etc.)
});
