"use strict";
const { hashPassword } = require("../helpers/bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Product, {
        foreignKey: "UserId",
      });
      User.belongsToMany(models.Role, {
        through: "UserRoles",
        foreignKey: "UserId",
        otherKey: "RoleId",
        as: "Roles",
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "email not valid",
          },
          notNull: {
            msg: "name is required",
          },
          notEmpty: {
            msg: "name is required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "password is required",
          },
          notEmpty: {
            msg: "password is required",
          },
          len: {
            args: [8, 64],
            msg: "password must be 8 - 64 character long",
          },
        },
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
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isIn: {
            args: [["male", "female"]],
            msg: "gender must be male or female",
          },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
        validate: {
          notNull: {
            msg: "status is required",
          },
          notEmpty: {
            msg: "status is required",
          },
          isIn: {
            args: [["active", "inactive"]],
            msg: "Status must be active or inactive",
          },
        },
      },
      birthdate: DataTypes.DATE,
      phone: DataTypes.STRING,
      country: DataTypes.STRING,
      province: DataTypes.STRING,
      regency: DataTypes.STRING,
      district: DataTypes.STRING,
      village: DataTypes.STRING,
      zipCode: DataTypes.STRING,
      address: DataTypes.TEXT,
      profilePicture: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          user.password = hashPassword(user.password);
          user.status = "active";
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
