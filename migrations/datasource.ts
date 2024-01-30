// eslint-disable-next-line import/no-extraneous-dependencies
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { Scooter } from '../src/entities/scooter.entity';
import { ScooterType } from '../src/entities/scooterType.entity';
import { Migrations1706534204356 } from './1706534204356-migrations';

const options: DataSourceOptions = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [User, ScooterType, Scooter],
  migrations: [Migrations1706534204356],
  synchronize: true,
};

export default new DataSource(options);
