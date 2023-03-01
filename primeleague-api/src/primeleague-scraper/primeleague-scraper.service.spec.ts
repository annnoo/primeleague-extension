import { Test, TestingModule } from '@nestjs/testing';
import { PrimeleagueScraperService } from './primeleague-scraper.service';

describe('PrimeleagueScraperService', () => {
  let service: PrimeleagueScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrimeleagueScraperService],
    }).compile();

    service = module.get<PrimeleagueScraperService>(PrimeleagueScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
