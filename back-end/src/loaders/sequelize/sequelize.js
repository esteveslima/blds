const Sequelize = require('sequelize');
const dbConfig = require('./database');

const User = require('../../database/models/User');
const Travel = require('../../database/models/Travel');

exports.setupSequelize = () => {
  const sequelize = new Sequelize(dbConfig);

  sequelize.sync();

  User.init(sequelize);
  Travel.init(sequelize);

  User.associate(sequelize.models);
  Travel.associate(sequelize.models);
};
