import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user.entity';
import { createMockRepo } from './helper';
import { UsersModule } from '../src/users/users.module';

describe('AppController (e2e)', () => {
  const mockUser = { id: 1, name: 'name', age: 20 };
  const mockUserRepo = createMockRepo(mockUser);

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepo)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('users', () => {
    it('GET: /', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect([mockUser]);
      expect(mockUserRepo.find).toHaveBeenCalled();
    });

    it('GET: /:id', async () => {
      await request(app.getHttpServer())
        .get(`/users/${mockUser.id}`)
        .expect(200)
        .expect(mockUser);
      expect(mockUserRepo.findOneBy).toHaveBeenCalledWith({
        id: mockUser.id,
      });
    });

    it('PUT: /:id', async () => {
      const data = { name: 'new name' };

      await request(app.getHttpServer())
        .put(`/users/${mockUser.id}`)
        .set('Content-Type', 'application/json')
        .send(data)
        .expect(200)
        .expect({ id: mockUser.id, ...data });
      expect(mockUserRepo.update).toHaveBeenCalledWith(
        mockUser.id,
        expect.toContainKey('name') && expect.toContainValue(data.name),
      );
    });

    it('POST: /', async () => {
      const data = { name: 'new name', age: 90 };
      const result = {
        id: 3,
        isActive: true,
        ...data,
      };

      mockUserRepo.insert.mockImplementationOnce((input) => {
        input.isActive = true;
        input.id = 3;
      });

      await request(app.getHttpServer())
        .post('/users')
        .set('Content-Type', 'application/json')
        .send(data)
        .expect(201)
        .expect(result);
      expect(mockUserRepo.insert).toHaveBeenCalledWith(result);
    });

    it('DELETE: /:id', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${mockUser.id}`)
        .expect(200);
      expect(mockUserRepo.delete).toHaveBeenCalledWith(mockUser.id);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
