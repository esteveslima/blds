import type { RequestHandler } from 'express'; // eslint-disable-line no-unused-vars
import * as wrapAsync from '../../services/async/wrap-async';
import ErrorResponse from '../../services/error/structure/error-response';

import * as Travel from '../../database/dao/travelDao';

export const createTravel : RequestHandler = async (req, res) : Promise<void> => {
  const {
    peopleNumber, dateFrom, dateTo, origin, destination, userId,
  } = req.body;

  const travel = await Travel.create({
    peopleNumber, dateFrom, dateTo, origin, destination, userId,
  });
  if (!travel) throw new ErrorResponse(ErrorResponse.errorCodes.NOT_FOUND, travel);

  res.status(200).json({ travel });
};

export const getTravel : RequestHandler = async (req, res) : Promise<void> => {
  const { travelId } = req.params;

  const travel = await Travel.find(travelId, {
    include: { association: 'user' },
  });
  if (!travel) throw new ErrorResponse(ErrorResponse.errorCodes.NOT_FOUND, travel);

  res.status(200).json({ travel });
};

export const deleteTravel : RequestHandler = async (req, res) : Promise<void> => {
  const { travelId } = req.params;

  const travel = await Travel.remove({
    where: { id: travelId },
    force: true,
  });
  if (!travel) throw new ErrorResponse(ErrorResponse.errorCodes.NOT_FOUND, travel);

  res.status(200).json({ Status: 'true' });
};

wrapAsync.wrapAsyncFunctions(this);
