"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // Relasi Cart → User (Many-to-One)
      Cart.belongsTo(models.User);
      // Relasi Cart → Lecture (Many-to-One)
      Cart.belongsTo(models.Lecture);
    }
  }
  Cart.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      LectureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
