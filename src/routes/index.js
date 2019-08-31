import express from 'express';
import ServiceFactory from '../services/service-factory';

const router = express.Router();

router.get('/', (req, res) => {
  const languageService = ServiceFactory.getLanguageService(req);
  const languages = languageService.getLanguages();
  res.render('index', { languages });
});

export default router;
