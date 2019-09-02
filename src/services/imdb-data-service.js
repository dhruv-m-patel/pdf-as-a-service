import puppeteer from 'puppeteer';
import format from 'date-fns/format';
import cheerio from 'cheerio';
import ImdbData from '../models/imdb-data';

export default class ImdbDataService {
  constructor(logger, pdfService) {
    this.logger = logger;
    this.imdbHomePageUrl = 'https://www.imdb.com/';
    this.pdfService = pdfService;
  }

  async fetchImdbHomePage() {
    this.logger.info('Fetching IMDB home page...');
    return puppeteer.launch()
      .then(browser => browser.newPage())
      .then(page => page.goto(this.imdbHomePageUrl)
        .then(() => page.content().then(html => html)));
  }

  async fetchHomePageData() {
    const html = await this.fetchImdbHomePage();
    const todaysDate = format(new Date(), 'MM/dd/yyyy');
    const targetSectionTitles = ['Opening This Week', 'Now Playing (Box Office)', 'Coming Soon'];
    const map = {
      'Opening This Week': 'openingThisWeek',
      'Now Playing (Box Office)': 'nowPlaying',
      'Coming Soon': 'comingSoon',
    };

    const scrapedData = {
      openingThisWeek: [],
      nowPlaying: [],
      comingSoon: [],
    };

    const $ = cheerio.load(html);
    $('.aux-content-widget-2').each((i, section) => {
      const key = $('.oneline h3', section).text().trim();
      if (targetSectionTitles.includes(key)) {
        $('div.rhs-row', section).each((j, e) => {
          const data = {};
          data.movie = $('div.title a', e).first().text().trim();
          data.url = `https://www.imdb.com${$('div.title a', e).first().attr('href')}`;
          if (key === 'Now Playing (Box Office)') {
            data.boxOffice = $('div.title span.secondary-text', e).first().text();
            if ($('div.action', e).length) {
              data.showtimesUrl = `https://www.imdb.com${$('div.action a', e).first().attr('href')}`;
            }
          }
          scrapedData[map[key]].push(data);
        });
      }
    });

    return new ImdbData({
      fetchDate: todaysDate,
      ...scrapedData,
    });
  }

  async generateReport() {
    const movieData = await this.fetchHomePageData();
    return this.pdfService.generate('movie-report', movieData, 'ImdbMovieReport');
  }
}
