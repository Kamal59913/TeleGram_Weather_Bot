import { Test, TestingModule } from '@nestjs/testing';
import { TelegramAssignmentAstService } from './telegram-assignment-ast.service';

describe('TelegramAssignmentAstService', () => {
  let service: TelegramAssignmentAstService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramAssignmentAstService],
    }).compile();

    service = module.get<TelegramAssignmentAstService>(TelegramAssignmentAstService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
