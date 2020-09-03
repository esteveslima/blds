module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('travels', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      peopleNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dateFrom: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dateTo: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      origin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      destination: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('travels');
  },
};
