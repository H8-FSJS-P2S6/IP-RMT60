"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductPromo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductPromo.belongsTo(models.Product, {
        foreignKey: "ProductId",
      });
    }
  }
  ProductPromo.init(
    {
      ProductId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "product ID is required",
          },
          notEmpty: {
            msg: "product ID is required",
          },
        },
        references: {
          model: "Products",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "name is required",
          },
          notEmpty: {
            msg: "name is required",
          },
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "start date is required",
          },
          notEmpty: {
            msg: "start date is required",
          },
          isDate: {
            msg: "start date is not valid",
          },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "end date is required",
          },
          notEmpty: {
            msg: "end date is required",
          },
          isDate: {
            msg: "end date is not valid",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "price must be at least 1",
          },
          notNull: {
            msg: "price is required",
          },
          notEmpty: {
            msg: "price is required",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "stock cannot less than 0",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "ProductPromo",
    }
  );
  return ProductPromo;
};
