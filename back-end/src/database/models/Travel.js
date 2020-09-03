const { Model, DataTypes } = require('sequelize');

class travel extends Model {
  static init(connection) {
    super.init({
      peopleNumber: DataTypes.INTEGER,
      dateFrom: DataTypes.DATE,
      dateTo: DataTypes.DATE,
      origin: DataTypes.STRING,
      destination: DataTypes.STRING,
    }, {
      sequelize: connection,
    });
  }

  static associate(models) {
    this.belongsTo(models.user, { foreignKey: 'userId', as: 'user' });
  }
}

module.exports = travel;
