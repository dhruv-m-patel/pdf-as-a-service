import Language from '../models/language';

export default class LanguageService {
  constructor(logger) {
    this.logger = logger;
    this.languages = [
      new Language({ language: 'Spanish' }),
      new Language({ language: 'French' }),
      new Language({ language: 'German' }),
    ];
  }

  getLanguages() {
    return this.languages;
  }
}
