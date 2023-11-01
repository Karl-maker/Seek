import dotenv from 'dotenv';

dotenv.config();

const env = process.env;

export const config = {
  port: Number(env.PORT) || 3000,
  environment: env.NODE_ENV || "development",
  ssl: {
    file: {
      cert: env.SSL_CERT_FILE || null,
      key: env.SSL_KEY_FILE || null
    }
  },
  database: {
    development: {
      uri: env.MONGO_DB_DEV_URI || env.MONGO_DB_URI || "",
      name: env.MONGO_DB_DEV_NAME || env.MONGO_DB_NAME,
      password: env.MONGO_DB_DEV_PASS || env.MONGO_DB_PASS,
      user: env.MONGO_DB_DEV_USER || env.MONGO_DB_USER
    },
    production: {
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
  },
  twilio: {
    account_sid: env.TWILIO_ACCOUNT_SID,
    auth_token: env.TWILIO_AUTH_TOKEN,
    number: env.TWILIO_NUMBER
  }
  // Add other environment variables here...
};