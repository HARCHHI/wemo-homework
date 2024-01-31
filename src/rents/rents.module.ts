import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScootersModule } from '../scooters/scooters.module';
import { RentsService } from './rents.service';
import { RentsController } from './rents.controller';
import { RentsStatusService } from './rents-status.service';
import { Rent } from '../entities/rent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rent]), ScootersModule],
  controllers: [RentsController],
  providers: [RentsService, RentsStatusService],
})
export class RentsModule {}
