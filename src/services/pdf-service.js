import puppeteer from 'puppeteer';
import fs from 'fs';
import os from 'os';
import path from 'path';
import Handlebars from 'handlebars';
import assert from 'assert';
import getTime from 'date-fns/getTime';
import { sanitizeFileName } from '../lib/utils';
import * as handlebarsHelpers from '../lib/handlebar-helpers';

export default class PdfService {
  constructor(logger) {
    this.logger = logger;
  }

  async generate(reportTemplateFileName, data, generatedFileName) {
    assert(reportTemplateFileName.trim() !== '', 'reportTemplateFileName is required');
    assert(data !== null && data !== undefined && Object.keys(data).length > 0, 'data is required');
    assert(generatedFileName.trim() !== '', 'generatedFileName is required');

    try {
      const sanitizedFileName = sanitizeFileName(generatedFileName);
      const savePath = path.join(os.tmpdir(), `/${sanitizedFileName}_${getTime(new Date())}.pdf`);
      const templatePath = path.join(__dirname, `../views/templates/reports/${reportTemplateFileName}.hbs`);
      handlebarsHelpers.registerCommonHelpers();
      const template = Handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
      const pdfContent = template(data);

      // // for debug purposes, uncomment following line to create html file of the page to be printed
      // fs.writeFile(`${__dirname}/test.html`, pdfContent);

      this.logger.info('Creating browser');
      const browser = await puppeteer.launch({
        headless: true,
        args: ['–no-sandbox', '–disable-setuid-sandbox'],
      });
      this.logger.info('Browser created');
      try {
        this.logger.info('Creating page');
        const page = await browser.newPage();

        this.logger.info('Loading content');
        await page.emulateMedia('screen');
        await page.setContent(pdfContent, { waitUntil: 'domcontentloaded', timeout: 5000 });

        this.logger.info('Generating PDF...');
        await page.pdf({
          path: savePath,
          format: 'Letter',
          printBackground: true,
          displayHeaderFooter: false,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        });

        this.logger.info('PDF generated successfully!');
        await page.close();
      } catch (pdfError) {
        this.logger.error('PDF generation failed', { pdfError });
        throw pdfError;
      } finally {
        // close browser once pdf generation succeeds or fails
        await browser.close();
      }

      if (!fs.existsSync(savePath)) {
        this.logger.error('File not saved', { savePath, generatedFileName });
        throw new Error(`Failed to generate pdf: ${generatedFileName}`);
      }

      this.logger.info('Generated PDF file path:', savePath);

      return savePath;
    } catch (err) {
      this.logger.error('Error generating pdf: ', { err });
      throw err;
    }
  }
}
