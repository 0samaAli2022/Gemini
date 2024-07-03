import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimiter from '../middleware/rateLimiter.middleware.js';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';

export default (app) => {
  // helmet for security headers
  app.use(helmet());
  // rate limiter for api requests from same IP
  app.use('/api', rateLimiter);
  // morgan for logging in development
  if (process.env.NODE_ENV === 'dev') app.use(morgan('dev'));
  // json parser for parsing json
  app.use(express.json({ limit: '10kb' }));
  // body parser for parsing request body
  app.use(express.urlencoded({ extended: true }));
  // cookie parser for parsing cookies
  app.use(cookieParser());
  // xss for preventing xss attacks
  app.use(xss());
  // hpp for preventing parameter pollution attacks
  app.use(hpp());
  // cors for cross origin resource sharing
  app.use(cors());
};
//   app.use(express.static(`${__dirname}/public`));
