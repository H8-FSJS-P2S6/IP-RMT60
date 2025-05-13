const Joi = require("joi");

const createShippingAddressSchema = Joi.object({
  fullName: Joi.string().min(3).max(100).required().messages({
    "string.base": "Full name must be a string",
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters",
    "string.max": "Full name must not exceed 100 characters",
    "any.required": "Full name is required",
  }),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,13}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must contain only digits and be 10 to 13 characters long",
      "string.empty": "Phone number is required",
      "any.required": "Phone number is required",
    }),

  country: Joi.string().required().messages({
    "string.base": "Country must be a string",
    "string.empty": "Country is required",
    "any.required": "Country is required",
  }),

  province: Joi.string().required().messages({
    "string.base": "Province must be a string",
    "string.empty": "Province is required",
    "any.required": "Province is required",
  }),

  regency: Joi.string().required().messages({
    "string.base": "Regency must be a string",
    "string.empty": "Regency is required",
    "any.required": "Regency is required",
  }),

  district: Joi.string().required().messages({
    "string.base": "District must be a string",
    "string.empty": "District is required",
    "any.required": "District is required",
  }),

  village: Joi.string().required().messages({
    "string.base": "Village must be a string",
    "string.empty": "Village is required",
    "any.required": "Village is required",
  }),

  address: Joi.string().min(5).max(255).required().messages({
    "string.base": "Address must be a string",
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters",
    "string.max": "Address must not exceed 255 characters",
    "any.required": "Address is required",
  }),

  zipCode: Joi.string()
    .pattern(/^\d{5}$/)
    .required()
    .messages({
      "string.pattern.base": "ZIP Code must be exactly 5 digits",
      "string.empty": "ZIP Code is required",
      "any.required": "ZIP Code is required",
    }),
});

module.exports = { createShippingAddressSchema };
