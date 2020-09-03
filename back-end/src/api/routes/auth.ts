import express from 'express';
import * as auth from '../controllers/auth';

import * as validate from '../middlewares/validate-request';

export const joinToRouter = (mainRouter: express.Router) : void => {
  const userRouter = express.Router();
  mainRouter.use('/auth', userRouter);

  userRouter.post('/public/login', validate.verifyLogin, auth.login);
  userRouter.post('/logout', auth.logout);
};
