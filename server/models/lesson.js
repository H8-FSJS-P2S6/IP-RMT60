'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsTo(models.Lecture, {
        foreignKey: 'LectureId',
        as: 'lecture'
      });
      Lesson.hasMany(models.UserProgress, {
        foreignKey: 'currentLessonId',
        as: 'userProgresses'
      });
    }
  }
  Lesson.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Lesson title cannot be empty' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Video URL cannot be empty' },
        isUrl: { msg: 'Invalid video URL format' }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Duration must be at least 1 second' }
      }
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: { args: [1], msg: 'Order must be at least 1' }
      }
    },
    isPreview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    LectureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Lectures',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Lesson',
    indexes: [
      {
        fields: ['LectureId']
      },
      {
        fields: ['order']
      },
      {
        fields: ['LectureId', 'order'],
        unique: true
      }
    ]
  });
  return Lesson;
};
