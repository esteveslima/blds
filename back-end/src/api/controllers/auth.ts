import type { RequestHandler } from 'express'; // eslint-disable-line no-unused-vars
import { authenticate } from '../../services/auth/jwt';
import * as wrapAsync from '../../services/async/wrap-async';
import ErrorResponse from '../../services/error/structure/error-response';

import * as User from '../../database/dao/userDao ';

export const login : RequestHandler = async (req, res) : Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user) throw new ErrorResponse(ErrorResponse.errorCodes.LOGIN_FAILURE, email);

  const passwordsMatch = await User.matchPasswords(password, (user as any).password);
  if (!passwordsMatch) {
    throw new ErrorResponse(ErrorResponse.errorCodes.LOGIN_FAILURE, email);
  }

  const token = authenticate((user as any).id);

  res.cookie('token', token, {
    expires: new Date(Date.now() + process.env.JWT_EXPIRATION as any * 1000),
    httpOnly: true,
  });

  res.status(200).json({ Status: true, token });
};

export const logout : RequestHandler = async (req, res) : Promise<void> => {
  res.cookie('token', undefined, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ Status: true });
};

wrapAsync.wrapAsyncFunctions(this);
