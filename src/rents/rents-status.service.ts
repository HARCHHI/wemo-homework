import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT_TOKEN } from '../redis.module';
import { RentsError } from './rents.exception';

@Injectable()
export class RentsStatusService {
  redis: Redis;

  prefix = 'RentStatus';

  constructor(@Inject(REDIS_CLIENT_TOKEN) redis: Redis) {
    this.redis = redis;
  }

  async rent(userId: number, scooterId: number): Promise<void> {
    const limitedUsersKey = `${this.prefix}-LimitedUsers`;
    const isRented = await this.redis.hset(limitedUsersKey, userId, 1);

    if (isRented === 0) throw new Error(RentsError.MULTI_RENTED);

    const rentedScooterKey = `${this.prefix}-Scooter:${scooterId}:Rent`;

    const ts = Date.now();
    await this.redis.zadd(rentedScooterKey, ts, userId);
    const res = await this.redis.zrange(
      rentedScooterKey,
      '-inf',
      '+inf',
      'BYSCORE',
      'LIMIT',
      0,
      1,
    );
    if (res.length === 0 || parseInt(res[0], 10) !== userId) {
      await Promise.all([
        this.redis.zrem(rentedScooterKey, userId),
        this.redis.hdel(limitedUsersKey, userId.toString()),
      ]);
      throw new Error(RentsError.SCOOTER_RENTED);
    }
  }

  async return(userId: number, scooterId: number) {
    const rentedScooterKey = `${this.prefix}-Scooter:${scooterId}:Rent`;
    const limitedUsersKey = `${this.prefix}-LimitedUsers`;

    await Promise.all([
      this.redis.zrem(rentedScooterKey, userId),
      this.redis.hdel(limitedUsersKey, userId.toString()),
    ]);
  }
}
