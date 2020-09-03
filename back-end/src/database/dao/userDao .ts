import bcrypt from 'bcrypt';
import ErrorResponse from '../../services/error/structure/error-response';
import User from '../models/User';

interface Ifields { name: string, password: string, email: string, phone: string }

export const create = async (fields : Ifields) => {
  if (!/(?=^.{8,128}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(fields.password)) {
    throw new ErrorResponse(ErrorResponse.errorCodes.WEAK_PASSWORD, 'weak password');
  }
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(fields.password, saltRounds);
  fields.password = hashPassword; // eslint-disable-line no-param-reassign

  const user = await User.create(fields);
  (user as any).password = undefined;

  return user;
};

export const findById = async (id, options) => {
  const user = await User.findByPk(id, options);
  (user as any).password = undefined;
  return user;
};

export const findByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  return user;
};

export const matchPasswords = async (entryPassword, hashUserPassword) => {
  const passwordsMatch = await bcrypt.compare(entryPassword, hashUserPassword);
  return passwordsMatch;
};
