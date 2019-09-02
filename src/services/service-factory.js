import ImdbDataService from './imdb-data-service';
import PdfService from './pdf-service';

export default class ServiceFactory {
  static getLogger(req) {
    return req.app.get('logger');
  }

  static getMysqlClient(req) {
    return req.app.get('mysqlClient');
  }

  static getPdfService(req) {
    return new PdfService(ServiceFactory.getLogger(req));
  }

  static getImdbDataService(req) {
    return new ImdbDataService(
      ServiceFactory.getLogger(req),
      ServiceFactory.getPdfService(req),
    );
  }
}
