"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RolePermission.belongsTo(models.Role, { foreignKey: "RoleId" });
      RolePermission.belongsTo(models.Permission, {
        foreignKey: "PermissionId",
      });
    }
  }
  RolePermission.init(
    {
      RoleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Role required!",
          },
          notEmpty: {
            msg: "Role required!",
          },
        },
      },
      PermissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Permission required!",
          },
          notEmpty: {
            msg: "Permission required!",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
    }
  );
  return RolePermission;
};
