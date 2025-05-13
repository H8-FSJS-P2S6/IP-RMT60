"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Permission.belongsToMany(models.Role, {
        through: "RolePermissions",
        foreignKey: "PermissionId",
        otherKey: "RoleId",
        as: "Roles",
      });
    }
  }
  Permission.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name required!",
          },
          notEmpty: {
            msg: "Name required!",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Permission",
    }
  );
  return Permission;
};
