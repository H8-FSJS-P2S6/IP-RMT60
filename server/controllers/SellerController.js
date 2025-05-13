const { Product } = require("../models/index");
const { createProductSchema } = require("../validation/product.validation");

class SellerController {
  static async getProducts(req, res, next) {
    try {
      const products = await Product.findAll({
        where: {
          UserId: req.user.id,
        },
      });

      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const product = await Product.findOne({
        where: {
          id: req.params.id,
          UserId: req.user.id,
        },
      });

      if (!product) {
        throw { name: "NotFound", message: `Product not found` };
      }

      res.status(200).json({ data: product });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProductById(req, res, next) {
    try {
      const product = await Product.findOne({
        where: {
          id: req.params.id,
          UserId: req.user.id,
        },
      });
      if (!product) {
        throw { name: "NotFound", message: `Product not found` };
      }

      await product.destroy();

      res.status(200).json({ message: `${product.name} success to delete` });
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req, res, next) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw { name: "BadRequest", message: "Request body is required" };
      }

      const { error } = createProductSchema.validate(req.body);
      if (error) {
        throw { name: "BadRequest", message: error.message };
      }

      const {
        name,
        description,
        price,
        stock = 0,
        status = "draft",
      } = req.body;

      const product = await Product.create({
        name,
        description,
        price,
        stock,
        UserId: req.user.id,
      });

      res.status(201).json({ data: product });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updateProductById(req, res, next) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw { name: "BadRequest", message: "Request body is required" };
      }

      const { error } = createProductSchema.validate(req.body);
      if (error) {
        throw { name: "BadRequest", message: error.message };
      }

      const product = await Product.findOne({
        where: {
          id: req.params.id,
          UserId: req.user.id,
        },
      });
      if (!product) {
        throw { name: "NotFound", message: `Product not found` };
      }

      const {
        name,
        description,
        price,
        stock = 0,
        status = "draft",
      } = req.body;

      await product.update({
        name,
        description,
        price,
        stock,
        status,
      });

      res.status(200).json({ data: product });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = SellerController;
