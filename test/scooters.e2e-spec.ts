import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepo } from './helper';
import { ScootersModule } from '../src/scooters/scooters.module';
import { Scooter } from '../src/entities/scooter.entity';
import { ScooterType } from '../src/entities/scooterType.entity';

describe('AppController (e2e)', () => {
  const mockScooter = { id: 1, plate: 'TT-1000', typeId: 1 };
  const mockScooterType = { id: 1, name: 'name' };
  const mockScooterRepo = createMockRepo(mockScooter);
  const mockScooterTypeRepo = createMockRepo(mockScooterType);

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ScootersModule],
    })
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

  describe('scooters', () => {
    it('GET: /', async () => {
      await request(app.getHttpServer())
        .get('/scooters')
        .expect(200)
        .expect([mockScooter]);
      expect(mockScooterRepo.find).toHaveBeenCalled();
    });

    it('GET: /:id', async () => {
      await request(app.getHttpServer())
        .get(`/scooters/${mockScooter.id}`)
        .expect(200)
        .expect(mockScooter);
      expect(mockScooterRepo.findOneBy).toHaveBeenCalledWith({
        id: mockScooter.id,
      });
    });

    it('PUT: /:id', async () => {
      const data = { plate: 'TT-0002' };

      await request(app.getHttpServer())
        .put(`/scooters/${mockScooter.id}`)
        .set('Content-Type', 'application/json')
        .send(data)
        .expect(200)
        .expect({ id: mockScooter.id, ...data });
      expect(mockScooterRepo.update).toHaveBeenCalledWith(
        mockScooter.id,
        expect.toContainKey('name') && expect.toContainValue(data.plate),
      );
    });

    it('POST: /', async () => {
      const data = { plate: 'TT-0003', typeId: 2 };

      await request(app.getHttpServer())
        .post('/scooters')
        .set('Content-Type', 'application/json')
        .send(data)
        .expect(201)
        .expect(data);
      expect(mockScooterRepo.insert).toHaveBeenCalledWith(data);
    });

    it('DELETE: /:id', async () => {
      await request(app.getHttpServer())
        .delete(`/scooters/${mockScooter.id}`)
        .expect(200);
      expect(mockScooterRepo.delete).toHaveBeenCalledWith(mockScooter.id);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
