import express from 'express';
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
  res.download(report);
});

export default router;
