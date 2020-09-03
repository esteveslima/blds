import type { RequestHandler } from 'express'; // eslint-disable-line no-unused-vars
import * as wrapAsync from '../../services/async/wrap-async';
import ErrorResponse from '../../services/error/structure/error-response';

import User from '../../database/models/User';
import Travel from '../../database/models/Travel';

export const checkUser : RequestHandler = async (req, res, next) : Promise<void> => {
  const { userId } = req.body;

  const user = await User.findByPk(userId);

  if (!user) throw new ErrorResponse(ErrorResponse.errorCodes.NOT_FOUND, user);

  next();
};

export const checkTravel : RequestHandler = async (req, res, next) : Promise<void> => {
  const { travelId } = req.params;

  const travel = await Travel.findByPk(travelId);

  if (!travel) throw new ErrorResponse(ErrorResponse.errorCodes.NOT_FOUND, travel);

  next();
};

export const verifyLogin : RequestHandler = async (req, res, next) : Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorResponse(ErrorResponse.errorCodes.WRONG_PARAMETERS, { email });
  }

  next();
};

// Wrapping all functions for error catching
wrapAsync.wrapAsyncFunctions(this);
