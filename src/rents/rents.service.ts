import { randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Rent } from '../entities/rent.entity';
import { RentsStatusService } from './rents-status.service';
import { ScootersService } from '../scooters/scooters.service';
import { RentsError } from './rents.exception';

@Injectable()
export class RentsService {
  constructor(
    @InjectRepository(Rent)
    private rentRepo: Repository<Rent>,
    private statusService: RentsStatusService,
    private scootersService: ScootersService,
  ) {}

  findAll(): Promise<Rent[]> {
    return this.rentRepo.find();
  }

  findOne(id: number): Promise<Rent> {
    return this.rentRepo.findOneBy({ id });
  }

  async rent(userId: number, scooterId: number): Promise<Rent> {
    const scooter = await this.scootersService.findOne(scooterId);
    if (scooter === null) throw new Error(RentsError.SCOOTER_NOT_EXISTS);

    await this.statusService.rent(userId, scooterId);

    const data = new Rent();
    data.userId = userId;
    data.scooterId = scooterId;
    data.rentAt = new Date();
    data.token = randomBytes(24).toString('hex');

    await this.rentRepo.insert(data);

    return data;
  }

  async return(id: number, userId: number, token: string): Promise<Rent> {
    const rent = await this.rentRepo.findOne({
      where: { id, returnAt: IsNull() },
      select: ['token', 'returnAt', 'userId', 'scooterId'],
    });

    if (rent === null) throw new Error(RentsError.RECORD_NOT_EXISTS);
    if (token !== rent.token || userId !== rent.userId) {
      throw new Error(RentsError.TOKEN_INVALID);
    }
    rent.returnAt = new Date();
    await this.rentRepo.update(id, rent);
    await this.statusService.return(rent.userId, rent.scooterId);

    return rent;
  }
}
