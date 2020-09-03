const { Model, DataTypes } = require('sequelize');

class user extends Model {
  static init(connection) {
    super.init({
      name: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: { fields: ['email'], msg: 'This email already exists' },
        validate: {
          isEmail: { msg: 'Insert a valid email' },
        },
      },
      phone: {
        type: DataTypes.STRING,
      },
    }, {
      sequelize: connection,
    });
  }

  static associate(models) {
    this.hasMany(models.travel, { foreignKey: 'userId', as: 'travels' });
  }
}

module.exports = user;
