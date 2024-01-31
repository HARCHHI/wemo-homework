import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScootersModule } from './scooters/scooters.module';
import { UsersModule } from './users/users.module';
import { User } from './entities/user.entity';
import { ScooterType } from './entities/scooterType.entity';
import { Scooter } from './entities/scooter.entity';
import { RedisModule } from './redis.module';
import { Rent } from './entities/rent.entity';
import { RentsModule } from './rents/rents.module';

@Module({
  imports: [
    UsersModule,
    ScootersModule,
    RentsModule,
    ConfigModule.forRoot(),
    RedisModule.forRoot({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [User, Scooter, ScooterType, Rent],
      synchronize: false,
      autoLoadEntities: false,
    }),
  ],
})
export default class AppModule {}
