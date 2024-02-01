/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { Rent } from '../src/entities/rent.entity';
import { Scooter } from '../src/entities/scooter.entity';
import { ScooterType } from '../src/entities/scooterType.entity';
import { Migrations1706534204356 } from './1706534204356-migrations';

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT!, 10),
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  entities: [User, ScooterType, Scooter, Rent],
  migrations: [Migrations1706534204356],
  synchronize: true,
};

export default new DataSource(options);
