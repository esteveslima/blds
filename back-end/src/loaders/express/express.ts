import express from 'express';
import cookieParser from 'cookie-parser';
import * as cors from '../../services/security/cors';
import * as morgan from '../../services/log/morgan';

import router from '../../api/routes/router';
import errorHandler from '../../services/error/error-handler';

export default () : express.Application => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors.setupCors());
  app.use(morgan.setupMorgan());
  app.use(router());
  app.use(errorHandler);

  return app;
};
