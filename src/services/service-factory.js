import LanguageService from './language-service';

export default class ServiceFactory {
  static getLogger(req) {
    return req.app.get('logger');
  }

  static getMysqlClient(req) {
    return req.app.get('mysqlClient');
  }

  static getLanguageService(req) {
    return new LanguageService(ServiceFactory.getLogger(req));
  }
}
