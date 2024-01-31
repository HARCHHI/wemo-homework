import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';

describe('UsersController', () => {
  const mockService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'mock user' }]),
  };
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('metadata "path"', () => {
    it('should set "users"', () => {
      expect(Reflect.getMetadata('path', UsersController)).toEqual('users');
    });

    it('should set "/"', () => {
      expect(Reflect.getMetadata('path', controller.findAll)).toEqual('/');
    });

    it('should set ":id"', () => {
      expect(Reflect.getMetadata('path', controller.findOne)).toEqual(':id');
      expect(Reflect.getMetadata('path', controller.update)).toEqual(':id');
      expect(Reflect.getMetadata('path', controller.delete)).toEqual(':id');
    });
  });

  describe('controller method', () => {
    it('should call findAll of UsersService', async () => {
      const res = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(res).toHaveLength(1);
    });
  });
});
