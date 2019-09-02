import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import * as handlebarsHelpers from './handlebar-helpers';

export function sanitizeFileName(name) {
  return name.replace(new RegExp('[^a-zA-Z0-9-]+', 'g'), '_');
}

export function getPageHtml(pageTemplateName, data) {
  handlebarsHelpers.registerCommonHelpers();
  const template = Handlebars.compile(fs.readFileSync(path.join(__dirname, `../views/${pageTemplateName}.hbs`), 'utf8'));
  return template(data);
}
