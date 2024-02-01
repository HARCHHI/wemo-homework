import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rent } from '../src/entities/rent.entity';
import { RentsModule } from '../src/rents/rents.module';
import { createMockRedis, createMockRepo } from './helper';
import { REDIS_CLIENT_TOKEN, RedisModule } from '../src/redis.module';
import { Scooter } from '../src/entities/scooter.entity';
import { ScooterType } from '../src/entities/scooterType.entity';

describe('AppController (e2e)', () => {
  const mockRent = {
    id: 1,
    userId: 1,
    scooterId: 1,
    rentAt: null,
    token: 'token',
  };
  const mockScooter = { id: 1, type: 1, plate: 'TT-0001' };
  const mockRentRepo = createMockRepo(mockRent);
  const mockScooterRepo = createMockRepo(mockScooter);
  const mockScooterTypeRepo = createMockRepo(ScooterType);
  const mockRedis = createMockRedis();

  let app: INestApplication;
  let timeStr;

  beforeAll(async () => {
    jest.useFakeTimers();
    timeStr = new Date().toISOString();
    mockRent.rentAt = new Date();
    const mockRedisProvider = {
      provide: REDIS_CLIENT_TOKEN,
      useValue: mockRedis,
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        {
          global: true,
          module: RedisModule,
          providers: [mockRedisProvider],
          exports: [mockRedisProvider],
        },
        RentsModule,
      ],
    })
      .overrideProvider(getRepositoryToken(Rent))
      .useValue(mockRentRepo)
      .overrideProvider(getRepositoryToken(Scooter))
      .useValue(mockScooterRepo)
      .overrideProvider(getRepositoryToken(ScooterType))
      .useValue(mockScooterTypeRepo)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('rents', () => {
    it('GET: /', async () => {
      await request(app.getHttpServer())
        .get('/rents')
        .expect(200)
        .expect([{ ...mockRent, rentAt: timeStr }]);
      expect(mockRentRepo.find).toHaveBeenCalled();
    });

    it('GET: /:id', async () => {
      await request(app.getHttpServer())
        .get(`/rents/${mockRent.id}`)
        .expect(200)
        .expect({ ...mockRent, rentAt: timeStr });
      expect(mockRentRepo.findOneBy).toHaveBeenCalledWith({
        id: mockRent.id,
      });
    });

    it('PUT: /:id', async () => {
      const data = { userId: 1, token: 'token' };

      await request(app.getHttpServer())
        .put(`/rents/${mockRent.id}`)
        .set('Content-Type', 'application/json')
        .send(data)
        .expect(200)
        .expect({
          ...mockRent,
          rentAt: timeStr,
          returnAt: timeStr,
        });
      expect(mockRentRepo.update).toHaveBeenCalledWith(
        mockRent.id,
        expect.toContainKey('returnAt'),
      );
      expect(mockRedis.hdel).toHaveBeenCalled();
      expect(mockRedis.zrem).toHaveBeenCalled();
    });

    it('POST: /', async () => {
      const data = { scooterId: 1, userId: 1 };

      const res = await request(app.getHttpServer())
        .post('/rents')
        .set('Content-Type', 'application/json')
        .send(data)
        .expect(201);
      expect(res.body).toEqual({
        ...data,
        rentAt: timeStr,
        token: expect.toBeString(),
      });
      expect(mockRentRepo.insert).toHaveBeenCalled();
      expect(mockRedis.hset).toHaveBeenCalled();
      expect(mockRedis.zadd).toHaveBeenCalled();
      expect(mockRedis.zrange).toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
