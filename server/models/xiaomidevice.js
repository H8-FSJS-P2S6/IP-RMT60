// "use strict";
// const { Model } = require("sequelize");
// module.exports = (sequelize, DataTypes) => {
//   class XiaomiDevice extends Model {
//     static associate(models) {
//       XiaomiDevice.belongsToMany(models.User, {
//         through: models.Favorite,
//         foreignKey: "XiaomiDeviceId",
//       });
//     }
//   }
//   XiaomiDevice.init(
//     {
//       key: DataTypes.STRING,
//       device_name: DataTypes.STRING,
//       device_image: DataTypes.STRING,
//       display_size: DataTypes.STRING,
//       display_res: DataTypes.STRING,
//       camera: DataTypes.STRING,
//       video: DataTypes.STRING,
//       ram: DataTypes.STRING,
//       chipset: DataTypes.STRING,
//       battery: DataTypes.STRING,
//       batteryType: DataTypes.STRING,
//       body: DataTypes.STRING,
//       os_type: DataTypes.STRING,
//       storage: DataTypes.STRING,
//       comment: DataTypes.STRING,
//       price: DataTypes.INTEGER,
//     },
//     {
//       sequelize,
//       modelName: "XiaomiDevice",
//     }
//   );
//   return XiaomiDevice;
// };

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class XiaomiDevice extends Model {
    static associate(models) {
      XiaomiDevice.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: "XiaomiDeviceId",
      });
    }
  }
  XiaomiDevice.init(
    {
      key: DataTypes.STRING,
      device_name: DataTypes.STRING,
      device_image: DataTypes.STRING,
      display_size: DataTypes.STRING,
      display_res: DataTypes.STRING,
      camera: DataTypes.STRING,
      video: DataTypes.STRING,
      ram: DataTypes.STRING,
      chipset: DataTypes.STRING,
      battery: DataTypes.STRING,
      batteryType: DataTypes.STRING,
      body: DataTypes.STRING,
      os_type: DataTypes.STRING,
      storage: DataTypes.STRING,
      comment: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "XiaomiDevice",
    }
  );
  return XiaomiDevice;
};
