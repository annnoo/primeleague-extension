import { CacheTTL, CACHE_MANAGER, Controller, Get, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppService } from './app.service';
import { PrimeleagueScraperService } from './primeleague-scraper/primeleague-scraper.service';

@Controller()
export class AppController {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) { }


  // Gets the data from the cache and returns it

  @Get()
  @CacheTTL(3000)
  getPrimeData() {
    console.log(this.cache.get('div1'))
    return this.cache.get('div1');
  }
}
