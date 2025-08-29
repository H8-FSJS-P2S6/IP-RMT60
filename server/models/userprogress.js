'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProgress extends Model {
    static associate(models) {
      UserProgress.belongsTo(models.User, {
        foreignKey: 'UserId',
        as: 'user'
      });
      UserProgress.belongsTo(models.Lecture, {
        foreignKey: 'LectureId',
        as: 'lecture'
      });
      UserProgress.belongsTo(models.Lesson, {
        foreignKey: 'currentLessonId',
        as: 'currentLesson'
      });
    }
  }
  UserProgress.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    LectureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Lectures',
        key: 'id'
      }
    },
    currentLessonId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Lessons',
        key: 'id'
      }
    },
    completedLessons: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    },
    progressPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 100
      }
    },
    lastWatchedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    totalWatchTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'UserProgress',
    indexes: [
      {
        fields: ['UserId']
      },
      {
        fields: ['LectureId']
      },
      {
        fields: ['UserId', 'LectureId'],
        unique: true
      }
    ]
  });
  return UserProgress;
};
