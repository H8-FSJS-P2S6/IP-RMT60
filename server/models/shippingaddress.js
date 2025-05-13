"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShippingAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ShippingAddress.belongsTo(models.User, {
        foreignKey: "UserId",
      });
    }
  }
  ShippingAddress.init(
    {
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
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "fullname is required",
          },
          notEmpty: {
            msg: "fullname is required",
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "phone number is required",
          },
          notEmpty: {
            msg: "phone number is required",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "address is required",
          },
          notEmpty: {
            msg: "address is required",
          },
        },
      },
      village: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "village is required",
          },
          notEmpty: {
            msg: "village is required",
          },
        },
      },
      district: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "district is required",
          },
          notEmpty: {
            msg: "district is required",
          },
        },
      },
      regency: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "regency is required",
          },
          notEmpty: {
            msg: "regency is required",
          },
        },
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "province is required",
          },
          notEmpty: {
            msg: "province is required",
          },
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "country is required",
          },
          notEmpty: {
            msg: "country is required",
          },
        },
      },
      zipCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "zip code must be an integer",
          },
          notNull: {
            msg: "zip code is required",
          },
          notEmpty: {
            msg: "zip code is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "ShippingAddress",
    }
  );
  return ShippingAddress;
};
