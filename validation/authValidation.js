const Joi = require("joi");

const username = Joi.string().alphanum().min(3).max(30).required();
const email = Joi.string().email().required();
const password = Joi.string().min(6).max(100).required();

const loginSchema = Joi.object({
  username,
  password,
});

const registerSchema = Joi.object({
  username,
  email,
  password,
});

const forgotPasswordSchema = Joi.object({
  email,
});

const resetPasswordSchema = Joi.object({
  password,
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).max(100).required(),
  newPassword: Joi.string().min(6).max(100).required(),
});

module.exports = {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
