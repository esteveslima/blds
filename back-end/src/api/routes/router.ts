import express from 'express';
import * as travelRouter from './travel';
import * as userRouter from './user';
import * as authRouter from './auth';
import { authorization } from '../../services/auth/jwt';

export default () : express.Router => {
  const router = express.Router();

  router.get('/public/status', (req, res/* , next */) : void => {
    res.status(200).json({ Status: true });
  });

  router.all(/^((?!\/public\/).)*$/i, authorization);

  travelRouter.joinToRouter(router);
  userRouter.joinToRouter(router);
  authRouter.joinToRouter(router);

  router.all('*', (req, res/* , next */) : void => {
    res.status(404).json({ Status: false, message: 'Route not found' });
  });

  return router;
};
