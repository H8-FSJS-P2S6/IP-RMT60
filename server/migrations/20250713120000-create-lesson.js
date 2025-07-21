'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Lessons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      videoUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Duration in seconds'
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      isPreview: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this lesson can be previewed without purchase'
      },
      LectureId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Lectures',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
    await queryInterface.addIndex('Lessons', ['LectureId']);
    await queryInterface.addIndex('Lessons', ['order']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Lessons');
  }
};
