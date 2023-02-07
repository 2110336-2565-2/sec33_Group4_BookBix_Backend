import { Test, TestingModule } from '@nestjs/testing';
import { LogoutController } from './logout.controller';

describe('LogoutController', () => {
  let controller: LogoutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogoutController],
    }).compile();

    controller = module.get<LogoutController>(LogoutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
