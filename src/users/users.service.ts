import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const user = new User();

    user.age = data.age;
    user.name = data.name;
    await this.usersRepo.insert(user);

    return user;
  }

  findOne(id: number): Promise<User> {
    return this.usersRepo.findOneBy({ id });
  }

  findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const user = new User();

    user.id = id;
    user.age = data.age;
    user.name = data.name;
    user.isActive = data.isActive;
    await this.usersRepo.update(id, user);

    return user;
  }

  async delete(id: number): Promise<void> {
    await this.usersRepo.delete(id);
  }
}
