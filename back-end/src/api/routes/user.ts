import express from 'express';
import * as user from '../controllers/user';

export const joinToRouter = (mainRouter: express.Router) : void => {
  const userRouter = express.Router();
  mainRouter.use('/user', userRouter);

  userRouter.post('/public/create', user.createUser);
  userRouter.get('/get/:userId', user.getUser);
};
