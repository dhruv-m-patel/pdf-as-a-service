import Handlebars from 'handlebars';
import { format } from 'date-fns';

export function registerCommonHelpers() {
  Handlebars.registerHelper('ifNot', (item, opts) => (item === true ? opts.inverse(item) : opts.fn(item)));
  Handlebars.registerHelper('ifUndefined', (item, opts) => (item === undefined ? opts.fn(item) : opts.inverse(item)));
  Handlebars.registerHelper('getReadableDate', dt => format(dt, 'MMM D, h:mm a'));
  Handlebars.registerHelper('json', object => new Handlebars.SafeString(JSON.stringify(object)));

  /**
   * if conditionals for Handlebars with operator comparison
   */
  Handlebars.registerHelper('ifCond', (v1, op, v2, opts) => {
    switch (op) {
      // eslint-disable-next-line eqeqeq
      case '==':
        return (v1 == v2) ? opts.fn(this) : opts.inverse(this);
      // eslint-disable-next-line eqeqeq
      case '!=':
        return (v1 != v2) ? opts.fn(this) : opts.inverse(this);
      case '===':
        return (v1 === v2) ? opts.fn(this) : opts.inverse(this);
      case '!==':
        return (v1 !== v2) ? opts.fn(this) : opts.inverse(this);
      case '&&':
        return (v1 && v2) ? opts.fn(this) : opts.inverse(this);
      case '||':
        return (v1 || v2) ? opts.fn(this) : opts.inverse(this);
      case '<':
        return (v1 < v2) ? opts.fn(this) : opts.inverse(this);
      case '<=':
        return (v1 <= v2) ? opts.fn(this) : opts.inverse(this);
      case '>':
        return (v1 > v2) ? opts.fn(this) : opts.inverse(this);
      case '>=':
        return (v1 >= v2) ? opts.fn(this) : opts.inverse(this);
      /* eslint-disable no-eval */
      default:
        return eval(`${v1}${op}${v2}`) ? opts.fn(this) : opts.inverse(this);
    }
  });
}
