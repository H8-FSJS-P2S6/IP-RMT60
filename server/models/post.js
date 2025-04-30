'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'driverId', as: 'driver' });
    }
  }
  Post.init({
    driverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notEmpty: true }
    },
    truckType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    maxWeight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 }
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    availableDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: { isDate: true }
    },
    availableTime: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    shippingCost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 }
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};