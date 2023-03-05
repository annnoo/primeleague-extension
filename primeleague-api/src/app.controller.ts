import { CacheTTL, CACHE_MANAGER, Controller, Get, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppService } from './app.service';
import { PrimeleagueScraperService } from './primeleague-scraper/primeleague-scraper.service';
import { ScheduleService } from './schedule.service';

@Controller()
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly scheduleService: ScheduleService,
  ) { }


  // Gets the data from the cache and returns it

  @Get()
  @CacheTTL(3000)
  async getPrimeData() {
    console.log(this.cache.get('div1'))
    const result = await this.cache.get('div1');
    if (!result) {
      await this.scheduleService.refreshDiv1Data();
    }
    return await this.cache.get('div1');
  }
}
