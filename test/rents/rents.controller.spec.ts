import { Test, TestingModule } from '@nestjs/testing';
import { RentsController } from '../../src/rents/rents.controller';
import { RentsService } from '../../src/rents/rents.service';
import { RentsExceptionFilter } from '../../src/rents/rents-exception.filter';

describe('ScootersController', () => {
  let controller: RentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentsController],
      providers: [{ provide: RentsService, useValue: {} }],
    }).compile();

    controller = module.get<RentsController>(RentsController);
  });

  describe('metadata "path"', () => {
    it('should set "scooters"', () => {
      expect(Reflect.getMetadata('path', RentsController)).toEqual('rents');
    });

    it('should set "/"', () => {
      expect(Reflect.getMetadata('path', controller.findAll)).toEqual('/');
      expect(Reflect.getMetadata('path', controller.rent)).toEqual('/');
    });

    it('should set ":id"', () => {
      expect(Reflect.getMetadata('path', controller.findOne)).toEqual(':id');
      expect(Reflect.getMetadata('path', controller.return)).toEqual(':id');
    });
  });

  describe('metadata "__exceptionFilters__"', () => {
    it('should filter exceptions by RentsExceptionFilter', () => {
      expect(
        Reflect.getMetadata('__exceptionFilters__', controller.rent)[0],
      ).toBeInstanceOf(RentsExceptionFilter);
      expect(
        Reflect.getMetadata('__exceptionFilters__', controller.return)[0],
      ).toBeInstanceOf(RentsExceptionFilter);
    });
  });
});
