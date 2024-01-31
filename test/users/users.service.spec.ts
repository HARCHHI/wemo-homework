import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../../src/users/users.service';
import { User } from '../../src/entities/user.entity';

describe('UsersService', () => {
  const mockUser = { id: 1, name: 'mock user', age: 20 };
  const mockRepo = {
    insert: jest.fn().mockResolvedValue(null),
    findOneBy: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockResolvedValue([mockUser, mockUser]),
    update: jest.fn().mockResolvedValue(null),
  };
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should convert CreateUserDto to User entity and insert to DB', async () => {
    const input = { name: 'test user', age: 10 };
    const res = await service.create(input);

    expect(mockRepo.insert).toHaveBeenCalledWith(input);
    expect(res).toEqual(input);
  });

  it('should get User by id', async () => {
    const res = await service.findOne(1);

    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(res).toEqual(mockUser);
  });

  it('should get all Users', async () => {
    const res = await service.findAll();

    expect(mockRepo.find).toHaveBeenCalled();
    expect(res).toEqual([mockUser, mockUser]);
  });

  it('should convert UpdateUserDto to User entity and update to DB', async () => {
    const id = 1;
    const input = { name: 'test' };
    const res = await service.update(id, input);

    expect(mockRepo.update).toHaveBeenCalledWith(id, { id, ...input });
    expect(res).toEqual({ id, ...input });
  });
});
