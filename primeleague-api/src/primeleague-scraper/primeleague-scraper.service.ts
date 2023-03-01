import { Injectable } from '@nestjs/common';
import puppeteer, { ElementHandle } from 'puppeteer'

const primePage = 'https://www.primeleague.gg/coverages/30730-division-1-spring-split-2023';

@Injectable()
export class PrimeleagueScraperService {

  async getPage() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(primePage)
    await page.setViewport({ width: 1600, height: 900 });

    const a = await page.$$(".ranking");
    const table = a[0];
    const rows = await table.$$("tr");

    const tableStandings = await Promise.allSettled(rows.map(el => el.evaluate(i => {
      const cells = i.querySelectorAll('td');
      const [placeElem, teamElem, statsElem] = cells;
      const place = placeElem.querySelector('a').innerText;
      const teamLink = placeElem.querySelector('a').href;

      let teamImgSrc = teamElem.querySelector('img').src;
      teamImgSrc = teamImgSrc.substring(0, teamImgSrc.indexOf('?'));

      const teamName = teamElem.querySelector('span').innerText;

      const stats = statsElem.querySelector('a').innerText;

      return {
        teamName,
        teamImgSrc,
        place,
        stats,
        teamLink
      };

    })));

    const tableGames = await this.parseStandingsTable(a[1])

    const games = tableGames.map(day => {
      return day.filter(i => i.teamA.slug === 'NNO' || i.teamB.slug === 'NNO');
    })

     return {
      standings: tableStandings.filter(i => i.status === 'fulfilled'),
      games,
    };
  }

  async parseStandingsTable(containerElement: ElementHandle<Element>) {

    const dayHeaders = await containerElement.$$('h4');
    const tables = await containerElement.$$('table');

    const results = await (Promise.all(tables.map(async (i) => await this.parseSingleStandingsTable(i))));


    return results;

  }

  async parseSingleStandingsTable(containerElement: ElementHandle<Element>) {
    const body = await containerElement.$('tbody');
    const rows = await body.$$('tr');

    return await Promise.all(rows.map(async ( row) => {
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


        const standingSpans =standing.querySelectorAll('span');

        console.log(standingSpans);

        console.log(standingSpans[2]);
 
        let standingText =  ''
        if(standingSpans[2]){
          standingText = standingSpans[2].innerText;
        }

        const [teamAWins, teamBWins] = standingText.split(':');

        const result =  {
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

        if(result.teamA.wins > result.teamB.wins){
          result.winner = result.teamA.slug;
        }
        if(result.teamB.wins > result.teamA.wins){
          result.winner = result.teamB.slug;
        }



        return result; 


      })
    }));


  }

}

