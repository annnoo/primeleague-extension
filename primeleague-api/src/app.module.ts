import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrimeleagueScraperService } from './primeleague-scraper/primeleague-scraper.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrimeleagueScraperService],
})
export class AppModule {}
