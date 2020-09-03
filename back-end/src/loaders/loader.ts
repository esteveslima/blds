import * as dotenv from '../services/env/dotenv';
import expressLoader from './express/express';
import sequelizeLoader from './sequelize/sequelize';

export default async () => {
  dotenv.setupDotenv();

  const expressApp = expressLoader();

  sequelizeLoader.setupSequelize();

  return expressApp;
};
