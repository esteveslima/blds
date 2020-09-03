import Travel from '../models/Travel';

export const create = async (fields) => {
  const travel = await Travel.create(fields);
  return travel;
};

export const find = async (id, options) => {
  const travel = await Travel.findByPk(id, options);
  return travel;
};

export const remove = async (condition) => {
  const travel = await Travel.destroy(condition);
  return travel;
};
