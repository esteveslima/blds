import type { RequestHandler } from 'express'; // eslint-disable-line no-unused-vars
import * as wrapAsync from '../../services/async/wrap-async';
import ErrorResponse from '../../services/error/structure/error-response';

import * as User from '../../database/dao/userDao ';

export const createUser : RequestHandler = async (req, res) : Promise<void> => {
  const {
    name, email, password, phone,
  } = req.body;

  const user = await User.create({
    name, password, email, phone,
  });
  if (!user) throw new ErrorResponse(ErrorResponse.errorCodes.NOT_FOUND, user);

  res.status(200).json({ user });
};

export const getUser : RequestHandler = async (req, res) : Promise<void> => {
  const { userId } = req.params;

  const user = await User.findById(userId, {
    include: { association: 'travels' },
  });
  if (!user) throw new ErrorResponse(ErrorResponse.errorCodes.NOT_FOUND, user);

  res.status(200).json({ user });
};

wrapAsync.wrapAsyncFunctions(this);
