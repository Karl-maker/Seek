import dotenv from 'dotenv';

dotenv.config();

const env = process.env;

export const config = {
  port: Number(env.PORT) || 3000,
  ssl: {
    file: {
      cert: env.SSL_CERT_FILE || null,
      key: env.SSL_KEY_FILE || null
    }
  },
  database: {
    live: {
        uri: env.MONGO_DB_URI || "",
        name: env.MONGO_DB_NAME,
        password: env.MONGO_DB_PASS,
        user: env.MONGO_DB_USER
    },
    test: {
        uri: env.MONGO_DB_TEST_URI || "",
        name: env.MONGO_DB_TEST_NAME,
        password: env.MONGO_DB_TEST_PASS,
        user: env.MONGO_DB_TEST_USER
    }
  }
  // Add other environment variables here...
};