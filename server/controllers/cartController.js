const { Cart, Lecture, Category, User } = require("../models");

class CartController {
  static async getUserCart(req, res, next) {
    try {
      const userId = req.user.id;

      const carts = await Cart.findAll({
        where: { UserId: userId },
        include: [
          {
            model: Lecture,
            include: [
              {
                model: Category,
                as: "category",
              },
            ],
          },
        ],
      });

      res.status(200).json(carts);
    } catch (err) {
      next(err);
    }
  }

  static async addToCart(req, res, next) {
    try {
      const UserId = req.user.id;
      const { lectureId } = req.body;

      // Check if lecture exists
      const lecture = await Lecture.findByPk(lectureId);
      if (!lecture) {
        throw { name: "NotFound", message: "Lecture not found" };
      }

      // Check if already in cart
      const existingCart = await Cart.findOne({
        where: {
          UserId,
          LectureId: lectureId,
        },
      });

      if (existingCart) {
        throw { name: "BadRequest", message: "Lecture already in cart" };
      }

      const newCart = await Cart.create({
        UserId,
        LectureId: lectureId,
      });

      res.status(201).json(newCart);
    } catch (err) {
      next(err);
    }
  }

  static async removeFromCart(req, res, next) {
    try {
      const UserId = req.user.id;
      const { LectureId } = req.params;

      console.log("Attempting to remove cart item:", { LectureId, UserId });

      const parsedLectureId = parseInt(LectureId, 10);
      if (isNaN(parsedLectureId)) {
        throw { name: "BadRequest", message: "Invalid LectureId" };
      }

      const cart = await Cart.findOne({
        where: { LectureId: parsedLectureId, UserId },
      });

      console.log("Cart item found:", cart);

      if (!cart) {
        throw { name: "NotFound", message: "Cart item not found" };
      }

      await cart.destroy();

      res
        .status(200)
        .json({ message: "Lecture removed from cart successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CartController;
