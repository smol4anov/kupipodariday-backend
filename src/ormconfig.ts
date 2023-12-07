import { DataSourceOptions } from 'typeorm';

require('dotenv').config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_URL || '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'test',
  password: process.env.DATABASE_PASSWORD || 'test',
  database: process.env.DATABASE_NAME || 'db',
  entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
};

export = config;
