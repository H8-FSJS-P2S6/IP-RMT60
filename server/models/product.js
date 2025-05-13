"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsToMany(models.Category, {
        through: "ProductCategories",
        foreignKey: "ProductId",
        otherKey: "CategoryId",
        as: "Categories",
      });
      Product.belongsTo(models.User, {
        foreignKey: "UserId",
      });
      Product.hasMany(models.ProductImage, {
        foreignKey: "ProductId",
        as: "Images",
      });
      Product.hasMany(models.ProductPromo, {
        foreignKey: "ProductId",
      });
    }
  }
  Product.init(
    {
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "description is required",
          },
          notEmpty: {
            msg: "description is required",
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
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "draft",
        validate: {
          isIn: {
            args: ["draft", "active", "rejected", "out_of_stock", "archived"],
            msg: "status must be draft or active or rejected or out_of_stock or archived",
          },
          notNull: {
            msg: "status is required",
          },
          notEmpty: {
            msg: "status is required",
          },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        validate: {
          notNull: {
            msg: "user ID is required",
          },
          notEmpty: {
            msg: "user ID is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
