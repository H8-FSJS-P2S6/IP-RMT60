const { Category } = require("../models/index");
const { createCategorySchema } = require("../validation/category.validation");

module.exports = class CategoryController {
  static async createCategory(req, res, next) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw { name: "BadRequest", message: "Request body is required" };
      }

      const { error } = createCategorySchema.validate(req.body);
      if (error) {
        throw { name: "BadRequest", message: error.message };
      }

      const category = await Category.create(req.body);

      res.status(201).json({ data: category });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getCategories(req, res, next) {
    try {
      const categories = await Category.findAll({
        attributes: ["id", "name"],
      });

      res.status(200).json({ data: categories });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updateCategoryById(req, res, next) {
    try {
      if (!req.params.id || isNaN(req.params.id)) {
        throw { name: "BadRequest", message: "id is not valid" };
      }

      const category = await Category.findByPk(req.params.id);

      if (!category) {
        throw { name: "NotFound", message: `Category not found` };
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        throw { name: "BadRequest", message: "Request body is required" };
      }

      const { error } = createCategorySchema.validate(req.body);
      if (error) {
        throw { name: "BadRequest", message: error.message };
      }

      const { name } = req.body;

      await category.update({ name });

      res.status(200).json({ data: category });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};
