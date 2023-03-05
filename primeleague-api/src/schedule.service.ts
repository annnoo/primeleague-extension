
// Service that refreshes the data from the primeleague website all 10 minutes and stores it in the cache

import { CACHE_MANAGER, Inject, Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { Cache } from "cache-manager";
import { PrimeleagueScraperService } from "./primeleague-scraper/primeleague-scraper.service";



@Injectable()
export class ScheduleService {

    logger = new Logger(ScheduleService.name)

    constructor(private readonly prime: PrimeleagueScraperService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
        this.refreshDiv1Data();
    }

    @Cron('0 */10 * * * *')
    refreshDiv1Data() {
        // refresh the data and store it in the cache if no error occures
        this.logger.log("Refreshing Div1 Data")
        this.prime.reloadDiv1().then((data) => {
            this.cacheManager.set('div1', data);
        }).catch(err => {
            this.logger.error(err)
        })
    }
}
