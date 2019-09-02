import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import stylus from 'stylus';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import winston from 'winston';
import Logger from './lib/logger';
import index from './routes/index';
import { getPageHtml } from './lib/utils';

global.Promise = require('bluebird').Promise;

dotenv.config();

const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'hbs');

// make static assets available from /assets virtual path
app.use(stylus.middleware(path.join(__dirname, './static')));
app.use('/assets', express.static(path.join(__dirname, './static')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('logger', Logger.getLogger());

app.use('/', index);
app.use('/index', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (process.env.env === 'local') {
    req.app.get('logger').error(err.message);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
  }
  // render the error page
  res.status(err.status || 500);
  const errorHtml = getPageHtml('error', err);
  res.send(errorHtml);
});


app.listen(process.env.PORT || 3000, () => {
  winston.info(`App listening on port ${process.env.PORT || 3000}!`);
});
