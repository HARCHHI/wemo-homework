import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { RentsService } from './rents.service';
import { CreateRentDto, ReturnScooterDto } from './dto/rent.dto';
import { Rent } from '../entities/rent.entity';
import { RentsExceptionFilter } from './rents-exception.filter';

@Controller('rents')
export class RentsController {
  constructor(private readonly rentService: RentsService) {}

  @Get()
  findAll(): Promise<Rent[]> {
    return this.rentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Rent> {
    return this.rentService.findOne(id);
  }

  @Post()
  @UseFilters(new RentsExceptionFilter())
  rent(@Body() { userId, scooterId }: CreateRentDto): Promise<Rent> {
    return this.rentService.rent(userId, scooterId);
  }

  @Put(':id')
  @UseFilters(new RentsExceptionFilter())
  return(@Param('id') id: number, @Body() { userId, token }: ReturnScooterDto) {
    return this.rentService.return(id, userId, token);
  }
}
