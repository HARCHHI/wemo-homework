import { Test, TestingModule } from '@nestjs/testing';
import { ScootersController } from '../../src/scooters/scooters.controller';
import { ScootersService } from '../../src/scooters/scooters.service';

describe('ScootersController', () => {
  let controller: ScootersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScootersController],
      providers: [{ provide: ScootersService, useValue: {} }],
    }).compile();

    controller = module.get<ScootersController>(ScootersController);
  });

  describe('metadata "path"', () => {
    it('should set "scooters"', () => {
      expect(Reflect.getMetadata('path', ScootersController)).toEqual(
        'scooters',
      );
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
});
