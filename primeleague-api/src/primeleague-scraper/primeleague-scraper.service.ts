import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer'

const primePage = 'https://www.primeleague.gg/coverages/30730-division-1-spring-split-2023';

export type Leaderboard = {
  standings: {
    teamName: string;
    teamImgSrc: string;
    place: string;
    stats: string;
    teamLink: string;
  }[];
  games: {
    teamA: {

      name: string;
      slug: string;
      wins: number;
      imgSrc: string;
    };
    teamB: {
      name: string;
      slug: string;
      wins: number;
      imgSrc: string;
    };
    standings: string;
    winner: string;
  }[][];
}


@Injectable()
export class PrimeleagueScraperService {


  logger = new Logger(PrimeleagueScraperService.name)
  browser: Browser;
  page: Page;


  constructor(private readonly http: HttpService) {
    this.initBrowser().then(() => {
      this.logger.log("Browser Initialized")
      this.reloadDiv1();
    })
  }

  async initBrowser() {

    // if skip chromium download is true, the executable path must be set, otherwise set it to undefined
    const executablePath = process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD === 'true' ? '/usr/bin/google-chrome' : undefined;

    this.browser = await puppeteer.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-setuid-sandbox'] });


    this.page = await this.browser.newPage();
  }


  async reloadDiv1(): Promise<Leaderboard> {
    this.logger.log("Reloading Div1 Data")
    const data = await this.getLeaderboard();
    this.downloadImages(data.standings);
    this.addImageSrc(data);
    return data;
  }

  addImageSrc(data: { standings: { teamName: string; teamImgSrc: string; place: string; stats: string; teamLink: string; }[]; games: { teamA: { name: string; slug: string; wins: number; imgSrc: string; }; teamB: { name: string; slug: string; wins: number; imgSrc: string; }; standings: string; winner: string; }[][]; }) {
    //add the local served image url 
    data.standings.forEach(i => {
      i.teamImgSrc = `/assets/${getImageName(i.teamImgSrc)}`
    })
  }



  async getLeaderboard() {
    await this.initBrowser();
    const page = this.page;
    await page.goto(primePage)
    await page.setViewport({ width: 1600, height: 900 });

    await page.waitForSelector(".ranking");

    const a = await page.$$(".ranking");
    const table = a[0];
    const rows = await table.$$("tr");

    const tableStandings = await Promise.allSettled(rows.map(el => el.evaluate(i => {
      const cells = i.querySelectorAll('td');
      const [placeElem, teamElem, statsElem] = cells;
      const place = placeElem.querySelector('a').innerText;
      const teamLink = placeElem.querySelector('a').href;

      let elems = teamElem.querySelectorAll('img');
      let teamImgSrc = '';
      if (elems.length == 1) {
        teamImgSrc = elems[0].src;
      }
      if (elems.length > 1) {
        elems = teamElem.querySelectorAll('img.img-light')
        teamImgSrc = elems[0].dataset['src']
      }

      teamImgSrc = teamImgSrc.substring(0, teamImgSrc.indexOf('?'));


      const teamName = teamElem.querySelector('span').innerText;

      const stats = statsElem.querySelector('a').innerText;
      const wins = Number(stats.substring(0, stats.indexOf('-')))
      const losses = Number(stats.substring(stats.indexOf('-') + 1, stats.length))

      return {
        teamName,
        teamImgSrc,
        place,
        stats,
        teamLink,
        wins,
        losses,
      };

    })));


    const standings = tableStandings.filter(i => i.status === 'fulfilled').map((i) => {
      if (i.status === 'fulfilled') {
        return i.value;
      }
    })

    const tableGames = await this.parseMatchesTable(a[1])

    const games = tableGames.map(day => {
      return day.filter(i => i.teamA.slug === 'NNO' || i.teamB.slug === 'NNO');
    })


    return {
      standings,
      games,
    };
  }


  async downloadImages(
    standings: {
      teamName: string;
      teamImgSrc: string;
    }[]
  ) {

    standings.forEach(async (i) => {
      if (!existsSync(__dirname + '/assets/')) {
        mkdirSync(__dirname + '/assets/')
      }

      const writer = createWriteStream(__dirname + `/assets/${getImageName(i.teamImgSrc)}`, { autoClose: true })
      const request = await this.http.axiosRef({ url: i.teamImgSrc, responseType: 'stream' })
      request.data.pipe(writer).on('finish', () => {
        this.logger.log(`Image ${i.teamName} downloaded to file /assets/${getImageName(i.teamImgSrc)}`)
      })
    })
  }

  async parseMatchesTable(containerElement: ElementHandle<Element>) {

    if (!containerElement) {
      return []
    }
    const dayHeaders = await containerElement.$$('h4');
    const tables = await containerElement.$$('table');

    const results = await (Promise.all(tables.map(async (i) => await this.parseSingleStandingsTable(i))));


    return results;

  }

  async parseSingleStandingsTable(containerElement: ElementHandle<Element>) {
    const body = await containerElement.$('tbody');
    const rows = await body.$$('tr');

    return await Promise.all(rows.map(async (row) => {
      return await row.evaluate(elem => {
        const [teamA, standing, teamB] = elem.querySelectorAll('td');




        let teamAName = teamA.querySelector('a').title;
        let teamAImgSrc = teamA.querySelector('img').src;
        teamAImgSrc = teamAImgSrc.substring(0, teamAImgSrc.indexOf('?'));
        let teamASlug = teamA.querySelector('span').innerText;


        const teamBName = teamB.querySelector('a').title;
        let teamBImgSrc = teamB.querySelector('img').src;
        teamBImgSrc = teamBImgSrc.substring(0, teamBImgSrc.indexOf('?'));
        const teamBSlug = teamB.querySelector('span').innerText;


        const standingSpans = standing.querySelectorAll('span');


        let standingText = ''
        if (standingSpans[2]) {
          standingText = standingSpans[2].innerText;
        }

        const [teamAWins, teamBWins] = standingText.split(':');

        const result = {
          teamA: {
            name: teamAName,
            slug: teamASlug,
            wins: +teamAWins,
            imgSrc: teamAImgSrc
          },
          teamB: {
            name: teamBName,
            slug: teamBSlug,
            wins: +teamBWins,
            imgSrc: teamBImgSrc
          },
          standings: standingText,
          winner: 'DRAW',
        }

        if (result.teamA.wins > result.teamB.wins) {
          result.winner = result.teamA.slug;
        }
        if (result.teamB.wins > result.teamA.wins) {
          result.winner = result.teamB.slug;
        }



        return result;


      })
    }));


  }

}

function getImageName(url: string) {
  return url.substring(url.lastIndexOf('/') + 1);
}
