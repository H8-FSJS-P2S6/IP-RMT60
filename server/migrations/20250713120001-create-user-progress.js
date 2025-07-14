'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserProgresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      currentLessonId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Lessons',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      completedLessons: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
      },
      progressPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.00,
        validate: {
          min: 0,
          max: 100
        }
      },
      lastWatchedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      totalWatchTime: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Total watch time in seconds'
      },
      isCompleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    
    await queryInterface.addIndex('UserProgresses', ['UserId']);
    await queryInterface.addIndex('UserProgresses', ['LectureId']);
    await queryInterface.addIndex('UserProgresses', ['UserId', 'LectureId'], { unique: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserProgresses');
  }
};
