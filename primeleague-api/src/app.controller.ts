import { CacheTTL, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrimeleagueScraperService } from './primeleague-scraper/primeleague-scraper.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
  private readonly prime: PrimeleagueScraperService) {}

  @Get()
  @CacheTTL(3000)
  getHello(){
    return this.prime.getPage();
  }
}
