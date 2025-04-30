'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: 'driverId', as: 'posts' });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true // Allow null for Google OAuth users
    },
    role: {
      type: DataTypes.ENUM('driver', 'user'),
      allowNull: false,
      validate: { notEmpty: true }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { is: /^\+?[1-9]\d{1,14}$/ }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};