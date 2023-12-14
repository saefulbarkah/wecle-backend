import dotenv from 'dotenv';
dotenv.config();

type env = {
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'production';
};

const { DATABASE_URL, NODE_ENV } = process.env as env;

export { DATABASE_URL, NODE_ENV };
