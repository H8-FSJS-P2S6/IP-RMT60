const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "name is required",
    "string.empty": "name is required",
  }),

  description: Joi.string().required().messages({
    "any.required": "description is required",
    "string.empty": "description is required",
  }),

  price: Joi.number().min(1).required().messages({
    "any.required": "price is required",
    "number.base": "price must be a number",
    "number.min": "price must be at least 1",
  }),

  stock: Joi.number().min(0).default(0).messages({
    "number.base": "stock must be a number",
    "number.min": "stock cannot less than 0",
  }),

  status: Joi.string()
    .valid("draft", "active", "rejected", "out_of_stock", "archived")
    .default("draft")
    .messages({
      "any.only":
        "status must be draft or active or rejected or out_of_stock or archived",
      "any.required": "status is required",
      "string.empty": "status is required",
    }),
});

module.exports = { createProductSchema };
