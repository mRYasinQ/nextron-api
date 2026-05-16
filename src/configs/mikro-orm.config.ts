import { defineConfig, SqliteDriver } from '@mikro-orm/sqlite';
import dotenv from 'dotenv';

dotenv.config();

const mikroOrmConfig = defineConfig({
  driver: SqliteDriver,

  migrations: {
    tableName: 'migrations',
    path: './dist/migrations',
    pathTs: './src/migrations',
  },

  dbName: process.env.DB_NAME,

  entities: ['./dist/modules/**/**/*.entity.js'],
  entitiesTs: ['./src/modules/**/**/*.entity.ts'],
});

export default mikroOrmConfig;
