import express from 'express';
import * as travel from '../controllers/travel';
import * as validate from '../middlewares/validate-request';

export const joinToRouter = (mainRouter: express.Router) : void => {
  const travelRouter = express.Router();
  mainRouter.use('/travel', travelRouter);

  travelRouter.post('/create', validate.checkUser, travel.createTravel);
  travelRouter.get('/get/:travelId', travel.getTravel);
  travelRouter.delete('/delete/:travelId', validate.checkTravel, travel.deleteTravel);
};
