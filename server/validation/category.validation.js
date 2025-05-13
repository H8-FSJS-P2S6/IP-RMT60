const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Category name must be a string",
    "string.empty": "Category name is required",
    "any.required": "Category name is required",
  }),
});

module.exports = {
  createCategorySchema,
};
