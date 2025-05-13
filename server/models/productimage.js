"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductImage.belongsTo(models.Product, {
        foreignKey: "ProductId",
      });
    }
  }
  ProductImage.init(
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
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "image is required",
          },
          notEmpty: {
            msg: "image is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "ProductImage",
    }
  );
  return ProductImage;
};
