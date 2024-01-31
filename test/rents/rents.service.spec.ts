import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rent } from '../../src/entities/rent.entity';
import { ScootersService } from '../../src/scooters/scooters.service';
import { RentsService } from '../../src/rents/rents.service';
import { RentsStatusService } from '../../src/rents/rents-status.service';
import { RentsError } from '../../src/rents/rents.exception';

describe('RentsServices', () => {
  const mockScooter = { id: 1, type: 1, plate: 'TT-0001' };
  const mockRent = {
    id: 1,
    token: 'token',
    userId: 1,
    scooterId: 1,
    rentAt: new Date(),
    returnAt: null,
  };
  let service: RentsService;
  const mockRepo = {
    find: jest.fn().mockResolvedValue([mockRent, mockRent]),
    findOne: jest.fn().mockResolvedValue(mockRent),
    findOneBy: jest.fn().mockResolvedValue(mockRent),
    insert: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(null),
  };
  const mockScooterService = {
    findOne: jest.fn().mockResolvedValue(mockScooter),
  };
  const mockStatusService = {
    rent: jest.fn().mockResolvedValue(null),
    return: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentsService,
        {
          provide: getRepositoryToken(Rent),
          useValue: mockRepo,
        },
        {
          provide: ScootersService,
          useValue: mockScooterService,
        },
        {
          provide: RentsStatusService,
          useValue: mockStatusService,
        },
      ],
    }).compile();

    service = module.get<RentsService>(RentsService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return Rent', async () => {
      const res = await service.findOne(mockRent.id);

      expect(res).toEqual(mockRent);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: mockRent.id });
    });
  });

  describe('findAll', () => {
    it('should return all Rents', async () => {
      const res = await service.findAll();

      expect(res).toHaveLength(2);
      expect(res[0]).toEqual(mockRent);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  describe('rent', () => {
    it('should pass the rent process without any exception', async () => {
      const scooterId = 1;
      const userId = 1;
      const res = await service.rent(userId, scooterId);

      expect(mockStatusService.rent).toHaveBeenCalledWith(userId, scooterId);
      expect(res.token).toBeString();
      expect(mockRepo.insert).toHaveBeenCalledWith(res);
    });

    it('should throw E_SCOOTER_NOT_EXISTS exception', async () => {
      const scooterId = 1;
      const userId = 1;

      mockScooterService.findOne.mockResolvedValueOnce(null);
      try {
        await service.rent(userId, scooterId);
        throw new Error('test failed');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(RentsError.SCOOTER_NOT_EXISTS);
      }
    });
  });

  describe('return', () => {
    it('should update returnAt data at Rent entity ', async () => {
      const scooterId = 1;
      const userId = 1;
      const res = await service.return(userId, scooterId, mockRent.token);

      expect(mockStatusService.return).toHaveBeenCalledWith(userId, scooterId);

      expect(mockRepo.findOne).toHaveBeenCalled();
      expect(mockRepo.update).toHaveBeenCalledWith(mockRent.id, res);
      expect(res.returnAt).toBeInstanceOf(Date);
    });

    it('should throw E_RENT_RECORD_NOT_EXISTS', async () => {
      const scooterId = 1;
      const userId = 1;

      mockRepo.findOne.mockResolvedValueOnce(null);

      try {
        await service.return(userId, scooterId, mockRent.token);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(RentsError.RECORD_NOT_EXISTS);
      }
    });

    it('should throw E_RENT_TOKEN_INVALID when token is wrong', async () => {
      const scooterId = 1;
      const userId = 1;

      try {
        await service.return(userId, scooterId, 'wrong token');
        throw new Error('test failed');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(RentsError.TOKEN_INVALID);
      }
    });

    it('should throw E_RENT_TOKEN_INVALID when userId is wrong', async () => {
      const scooterId = 9;
      const userId = 1;

      try {
        await service.return(userId, scooterId, mockRent.token);
        throw new Error('test failed');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(RentsError.TOKEN_INVALID);
      }
    });
  });
});
