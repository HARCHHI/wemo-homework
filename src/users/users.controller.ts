import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, data);
  }

  @Post()
  create(@Body() data: CreateUserDto): Promise<User> {
    return this.usersService.create(data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.usersService.delete(id);
  }
}
