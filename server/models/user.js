// "use strict";
// const { Model } = require("sequelize");
// const { hashPassword } = require("../helpers/bcrypt");

// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     static associate(models) {
//       User.belongsToMany(models.XiaomiDevice, {
//         through: models.Favorite,
//         foreignKey: "UserId",
//       });
//     }
//   }
//   User.init(
//     {
//       username: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//           notNull: {
//             msg: "Username tidak boleh null",
//           },
//           notEmpty: {
//             msg: "Username tidak boleh kosong",
//           },
//         },
//       },
//       email: {
//         type: DataTypes.STRING,
//         unique: true,
//         allowNull: false,
//         validate: {
//           notNull: {
//             msg: "Email tidak boleh null",
//           },
//           notEmpty: {
//             msg: "Email tidak boleh kosong",
//           },
//         },
//       },
//       password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//           notNull: {
//             msg: "Password tidak boleh null",
//           },
//           notEmpty: {
//             msg: "Password tidak boleh kosong",
//           },
//         },
//       },
//     },
//     {
//       hooks: {
//         beforeCreate: (user) => {
//           user.password = hashPassword(user.password);
//         },
//       },
//       sequelize,
//       modelName: "User",
//     }
//   );
//   return User;
// };

"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.XiaomiDevice, {
        through: models.Favorite,
        foreignKey: "UserId",
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Username tidak boleh null" },
          notEmpty: { msg: "Username tidak boleh kosong" },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: { msg: "Email tidak boleh null" },
          notEmpty: { msg: "Email tidak boleh kosong" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password tidak boleh null" },
          notEmpty: { msg: "Password tidak boleh kosong" },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (user) => {
          user.password = hashPassword(user.password);
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
