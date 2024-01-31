import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScootersService } from '../../src/scooters/scooters.service';
import { Scooter } from '../../src/entities/scooter.entity';

describe('ScooterService', () => {
  const mockScooter = { id: 1, plate: 'TT-0001', typeId: 1 };
  const mockRepo = {
    insert: jest.fn().mockResolvedValue(null),
    findOneBy: jest.fn().mockResolvedValue(mockScooter),
    find: jest.fn().mockResolvedValue([mockScooter, mockScooter]),
    update: jest.fn().mockResolvedValue(null),
  };
  let service: ScootersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScootersService,
        {
          provide: getRepositoryToken(Scooter),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ScootersService>(ScootersService);
  });

  it('should convert CreateScooterDto to Scooter entity and insert to DB', async () => {
    const input = { plate: 'TT-0001', typeId: 10 };
    const res = await service.create(input);

    expect(mockRepo.insert).toHaveBeenCalledWith(input);
    expect(res).toEqual(input);
  });

  it('should get Scooter by id', async () => {
    const res = await service.findOne(1);

    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(res).toEqual(mockScooter);
  });

  it('should get all Scooters', async () => {
    const res = await service.findAll();

    expect(mockRepo.find).toHaveBeenCalled();
    expect(res).toEqual([mockScooter, mockScooter]);
  });

  it('should convert UpdateScooterDto to Scooter entity and update to DB', async () => {
    const id = 1;
    const input = { plate: 'TT-0002', typeId: 4 };
    const res = await service.update(id, input);

    expect(mockRepo.update).toHaveBeenCalledWith(id, { id, ...input });
    expect(res).toEqual({ id, ...input });
  });
});
