import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../../../.env');
const result = dotenv.config({ path: envPath });

export const sequelize = new Sequelize(
    process.env.DATABASE_NAME!,
    process.env.DATABASE_USERNAME!,
    process.env.DATABASE_PASSWORD!,
    {
        host: process.env.DATABASE_HOST,
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

