// "use strict";
// const { Model } = require("sequelize");
// module.exports = (sequelize, DataTypes) => {
//   class Favorite extends Model {
//     static associate(models) {
//       Favorite.belongsTo(models.User, { foreignKey: "UserId" });
//       Favorite.belongsTo(models.XiaomiDevice, { foreignKey: "XiaomiDeviceId" });
//     }
//   }
//   Favorite.init(
//     {
//       UserId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: {
//           notNull: {
//             msg: "User ID tidak boleh null",
//           },
//           notEmpty: {
//             msg: "User ID tidak boleh kosong",
//           },
//         },
//       },
//       XiaomiDeviceId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: {
//           notNull: {
//             msg: "Xiaomi Device ID tidak boleh null",
//           },
//           notEmpty: {
//             msg: "Xiaomi Device ID tidak boleh kosong",
//           },
//         },
//       },
//     },
//     {
//       sequelize,
//       modelName: "Favorite",
//     }
//   );
//   return Favorite;
// };

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.User, {
        foreignKey: "UserId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Favorite.belongsTo(models.XiaomiDevice, {
        foreignKey: "XiaomiDeviceId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Favorite.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User ID tidak boleh null" },
          notEmpty: { msg: "User ID tidak boleh kosong" },
        },
      },
      XiaomiDeviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Xiaomi Device ID tidak boleh null" },
          notEmpty: { msg: "Xiaomi Device ID tidak boleh kosong" },
        },
      },
    },
    {
      sequelize,
      modelName: "Favorite",
    }
  );
  return Favorite;
};
