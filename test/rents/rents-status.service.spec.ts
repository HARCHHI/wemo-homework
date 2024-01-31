import { Test, TestingModule } from '@nestjs/testing';
import { REDIS_CLIENT_TOKEN } from '../../src/redis.module';
import { RentsStatusService } from '../../src/rents/rents-status.service';
import { RentsError } from '../../src/rents/rents.exception';

describe('rents-statusService', () => {
  const userAId = 1;
  const userBId = 2;
  const scooterId = 1;
  const hashKey = 'RentStatus-LimitedUsers';
  const sortedSetKey = `RentStatus-Scooter:${scooterId}:Rent`;
  let service: RentsStatusService;

  const mockRedis = {
    hset: jest.fn().mockResolvedValue(1),
    hdel: jest.fn().mockResolvedValue(null),
    zadd: jest.fn().mockResolvedValue(null),
    zrange: jest.fn().mockResolvedValue([userAId]),
    zrem: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentsStatusService,
        {
          provide: REDIS_CLIENT_TOKEN,
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<RentsStatusService>(RentsStatusService);
    jest.clearAllMocks();
  });

  describe('rent', () => {
    it("should save user's and scooter's rent status", async () => {
      await service.rent(userAId, scooterId);

      expect(service.redis.hset).toHaveBeenCalledWith(hashKey, userAId, 1);
      expect(service.redis.zadd).toHaveBeenCalledWith(
        sortedSetKey,
        expect.toBeNumber(),
        userAId,
      );
      expect(service.redis.zrange).toHaveBeenCalledWith(
        sortedSetKey,
        '-inf',
        '+inf',
        'BYSCORE',
        'LIMIT',
        0,
        1,
      );
    });

    it('should throw error E_USER_MULTI_RENTED when user has benn rented a scooter', async () => {
      mockRedis.hset.mockResolvedValueOnce(0);

      try {
        await service.rent(userAId, scooterId);
        throw new Error('test failed');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(RentsError.MULTI_RENTED);
        expect(service.redis.zadd).not.toHaveBeenCalled();
      }
    });

    it('should throw error E_SCOOTER_RENTED and rollback status when scooter has benn rented', async () => {
      mockRedis.zrange.mockResolvedValue([userBId]);

      try {
        await service.rent(userAId, scooterId);
        throw new Error('test failed');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(RentsError.SCOOTER_RENTED);
        expect(mockRedis.zrem).toHaveBeenCalledWith(sortedSetKey, userAId);
        expect(mockRedis.hdel).toHaveBeenCalledWith(
          hashKey,
          userAId.toString(),
        );
      }
    });
  });

  describe('return', () => {
    it('should unlock all status', async () => {
      await service.return(userAId, scooterId);

      expect(mockRedis.zrem).toHaveBeenCalledWith(sortedSetKey, userAId);
      expect(mockRedis.hdel).toHaveBeenCalledWith(hashKey, userAId.toString());
    });
  });
});
