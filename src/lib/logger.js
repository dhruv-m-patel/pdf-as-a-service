import winston from 'winston';

export default class Logger {
  static getLogger() {
    return new winston.Logger({
      transports: [
        new winston.transports.File({
          level: 'error',
          filename: '../../logs/error.log',
          handleExceptions: true,
          json: true,
          datePattern: '.yyyy-MM-dd',
          colorize: false,
        }),
        new winston.transports.Console({
          colorize: true,
        }),
      ],
      exitOnError: false,
    });
  }
}
