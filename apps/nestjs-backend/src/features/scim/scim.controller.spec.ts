import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ScimController } from './scim.controller';

describe('ScimController', () => {
  let controller: ScimController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScimController],
    }).compile();

    controller = module.get<ScimController>(ScimController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
