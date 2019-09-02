import express from 'express';
import fs from 'fs';
import ServiceFactory from '../services/service-factory';
import { getPageHtml } from '../lib/utils';

const router = express.Router();

router.get('/', async (req, res) => {
  const imdbDataService = ServiceFactory.getImdbDataService(req);
  const data = await imdbDataService.fetchHomePageData();
  const page = getPageHtml('index', data);
  res.send(page);
});

router.post('/pdf', async (req, res) => {
  const imdbDataService = ServiceFactory.getImdbDataService(req);
  const report = await imdbDataService.generateReport();
  imdbDataService.logger.info('Sending file...');
  res.setHeader("content-type", "application/pdf");
  fs.createReadStream(report).pipe(res);
  imdbDataService.logger.info('File sent, removing file from temp directory now');
  fs.unlinkSync(report);
  imdbDataService.logger.info('File removed', report);
});

export default router;
