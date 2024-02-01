import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RentsService } from './rents.service';
import { CreateRentDto, ReturnScooterDto } from './dto/rent.dto';
import { Rent } from '../entities/rent.entity';
import { RentsExceptionFilter } from './rents-exception.filter';

@ApiTags('rents')
@Controller('rents')
export class RentsController {
  constructor(private readonly rentService: RentsService) {}

  @Get()
  findAll(): Promise<Rent[]> {
    return this.rentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Rent> {
    return this.rentService.findOne(parseInt(id, 10));
  }

  @Post()
  @UseFilters(new RentsExceptionFilter())
  rent(@Body() { userId, scooterId }: CreateRentDto): Promise<Rent> {
    return this.rentService.rent(userId, scooterId);
  }

  @Put(':id')
  @UseFilters(new RentsExceptionFilter())
  return(@Param('id') id: string, @Body() { userId, token }: ReturnScooterDto) {
    return this.rentService.return(parseInt(id, 10), userId, token);
  }
}
