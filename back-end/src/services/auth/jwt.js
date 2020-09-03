import jwt from 'jsonwebtoken';
import ErrorResponse from '../error/structure/error-response';

export const authenticate = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: 60 * process.env.JWT_EXPIRATION,
  });
  return token;
};

export const authorization = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader ? authorizationHeader.split(' ')[1] : req.cookies.token;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return next(new ErrorResponse(ErrorResponse.errorCodes.UNHAUTORIZED, { token }));
  }
};
