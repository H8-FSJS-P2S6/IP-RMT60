'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TransactionDetail extends Model {
    static associate(models) {
      // Association definitions
      TransactionDetail.belongsTo(models.Transaction, { foreignKey: 'TransactionId' });
      TransactionDetail.belongsTo(models.Lecture, { foreignKey: 'LectureId' });
    }
  }
  
  TransactionDetail.init({
    TransactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Transaction ID is required' }
      }
    },
    LectureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Lecture ID is required' }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Price cannot be negative'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'TransactionDetail',
    indexes: [
      {
        unique: true,
        fields: ['TransactionId', 'LectureId'],
        name: 'unique_transaction_lecture'
      }
    ]
  });
  
  return TransactionDetail;
};