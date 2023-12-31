import dotenv from 'dotenv';
import path from 'path';

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
      uri: env.TEST_MONGO_DB_URL || "",
      name: env.TEST_MONGO_DB_NAME,
      password: env.TEST_MONGO_DB_PASS,
      user: env.TEST_MONGO_DB_USER
    }
  },
  twilio: {
    account_sid: env.TWILIO_ACCOUNT_SID,
    auth_token: env.TWILIO_AUTH_TOKEN,
    number: env.TWILIO_NUMBER
  },
  nodemailer: {
    service: env.NODEMAILER_SERVICE,
    host: env.NODEMAILER_HOST,
    port: env.NODEMAILER_PORT || 587,
    auth: {
      user: env.NODEMAILER_USER,
      password: env.NODEMAILER_PASS
    }
  },
  client: {
    url: env.CLIENT_URL || 'http://localhost:4000'
  },
  host: {
    url: env.SELF_URL || 'http://localhost:3000'
  },
  token: {
    access: {
      public: 'secret',
      private: 'secret',
      issuer: ""
    },
    refresh: {
      public: 'secret',
      private: 'secret',
      issuer: ""
    },
    general: {
      public: 'secret',
      private: 'secret',
      issuer: ""
    }
  },
  storage: {
    path: path.join(__dirname, env.STORAGE_PATH || "../../storage")
  }
  // Add other environment variables here...
};