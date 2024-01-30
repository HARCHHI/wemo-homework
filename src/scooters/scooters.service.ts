import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Scooter } from '../entities/scooter.entity';
import { CreateScooterDto, UpdateScooterDto } from './dto/scooter.dto';

@Injectable()
export class ScootersService {
  constructor(
    @InjectRepository(Scooter)
    private scooterRepo: Repository<Scooter>,
  ) {}

  findAll(): Promise<Scooter[]> {
    return this.scooterRepo.find({ relations: { type: true } });
  }

  findOne(id: number): Promise<Scooter> {
    return this.scooterRepo.findOneBy({ id });
  }

  async create(data: CreateScooterDto): Promise<Scooter> {
    const scooter = new Scooter();

    scooter.plate = data.plate;
    scooter.typeId = data.typeId;

    await this.scooterRepo.insert(scooter);

    return scooter;
  }

  async update(id: number, data: UpdateScooterDto): Promise<Scooter> {
    const scooter = new Scooter();

    scooter.id = id;
    scooter.plate = data.plate;
    scooter.typeId = data.typeId;

    await this.scooterRepo.update(id, scooter);

    return scooter;
  }

  async delete(id: number): Promise<void> {
    await this.scooterRepo.delete(id);
  }
}
