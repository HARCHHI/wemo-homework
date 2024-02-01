import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScootersService } from './scooters.service';
import { CreateScooterDto, UpdateScooterDto } from './dto/scooter.dto';
import { Scooter } from '../entities/scooter.entity';

@ApiTags('scooters')
@Controller('scooters')
export class ScootersController {
  constructor(private readonly scootersService: ScootersService) {}

  @Post()
  create(@Body() data: CreateScooterDto): Promise<Scooter> {
    return this.scootersService.create(data);
  }

  @Get()
  findAll(): Promise<Scooter[]> {
    return this.scootersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Scooter> {
    return this.scootersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() data: UpdateScooterDto,
  ): Promise<Scooter> {
    return this.scootersService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.scootersService.delete(id);
  }
}
