import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScooterType } from '../entities/scooterType.entity';
import { Scooter } from '../entities/scooter.entity';
import { ScootersController } from './scooters.controller';
import { ScootersService } from './scooters.service';

@Module({
  imports: [TypeOrmModule.forFeature([Scooter, ScooterType])],
  controllers: [ScootersController],
  providers: [ScootersService],
  exports: [ScootersService],
})
export class ScootersModule {}
