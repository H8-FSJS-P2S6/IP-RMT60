const { Cart, Lecture, User } = require("../models");

class CartController {
  static async getUserCart(req, res, next) {
    try {
      const userId = req.user.id;
      
      const carts = await Cart.findAll({
        where: { UserId: userId },
        include: [
          {
            model: Lecture,
            include: ["category"]
          }
        ]
      });
      
      res.status(200).json(carts);
    } catch (err) {
      next(err);
    }
  }

  static async addToCart(req, res, next) {
    try {
      const UserId = req.user.id;
      const { LectureId } = req.body;
      
      // Check if lecture exists
      const lecture = await Lecture.findByPk(LectureId);
      if (!lecture) {
        throw { name: "NotFound", message: "Lecture not found" };
      }
      
      // Check if already in cart
      const existingCart = await Cart.findOne({
        where: { UserId, LectureId }
      });
      
      if (existingCart) {
        throw { name: "BadRequest", message: "Lecture already in cart" };
      }
      
      const newCart = await Cart.create({
        UserId,
        LectureId
      });
      
      res.status(201).json(newCart);
    } catch (err) {
      next(err);
    }
  }

  static async removeFromCart(req, res, next) {
    try {
      const UserId = req.user.id;
      const { id } = req.params;
      
      const cart = await Cart.findOne({
        where: { id, UserId }
      });
      
      if (!cart) {
        throw { name: "NotFound", message: "Cart item not found" };
      }
      
      await cart.destroy();
      
      res.status(200).json({ message: "Lecture removed from cart successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CartController;