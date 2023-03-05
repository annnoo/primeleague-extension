import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrimeleagueScraperService } from './primeleague-scraper/primeleague-scraper.service';
import { ScheduleService } from './schedule.service';



@Module({
  imports: [HttpModule,
    // configure the path to the static assets that should be served via nestjs

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
      serveRoot: '/assets',
      serveStaticOptions: {
        maxAge: '3600',
        cacheControl: true
      }
    }),
    CacheModule.register(),

    ScheduleModule.forRoot()
  ],

  controllers: [AppController],
  providers: [AppService, PrimeleagueScraperService, ScheduleService],
})
export class AppModule {
} 
