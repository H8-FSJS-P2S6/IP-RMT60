const Joi = require("joi");

const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Invalid email format",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(8).required().messages({
    "string.empty": "Password must be at least 8 characters",
    "string.min": "Password must be at least 8 characters",
    "any.required": "Password is required",
  }),

  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Name harus berupa teks",
    "string.empty": "Name tidak boleh kosong",
    "string.min": "Name minimal harus terdiri dari 3 karakter",
    "string.max": "Name maksimal terdiri dari 100 karakter",
    "any.required": "Name wajib diisi",
  }),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,13}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Phone number must be 10 to 13 digits and contain only numbers",
    }),

  gender: Joi.string().valid("male", "female").allow(null).optional().messages({
    "string.base": "Gender must be a string",
    "any.only": 'Gender must be either "male" or "female"',
  }),

  birthdate: Joi.date().allow(null).optional().messages({
    "date.base": "Birthdate must be a valid date",
  }),

  country: Joi.string().allow(null).optional().messages({
    "string.base": "Country must be a string",
  }),

  province: Joi.string().allow(null).optional().messages({
    "string.base": "Province must be a string",
  }),

  regency: Joi.string().allow(null).optional().messages({
    "string.base": "Regency must be a string",
  }),

  district: Joi.string().allow(null).optional().messages({
    "string.base": "District must be a string",
  }),

  village: Joi.string().allow(null).optional().messages({
    "string.base": "Village must be a string",
  }),

  zipCode: Joi.string().allow(null).optional().messages({
    "string.base": "Zip code must be a string",
  }),

  address: Joi.string().optional().allow(null, "").messages({
    "string.base": "Address must be a string",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "invalid email format",
    "string.empty": "email is required",
    "any.required": "email is required",
  }),

  password: Joi.string().min(8).required().messages({
    "string.empty": "password is required",
    "string.min": "password must be at least 8 characters",
    "any.required": "password is required",
  }),
});

module.exports = {
  createUserSchema,
  loginSchema,
};
