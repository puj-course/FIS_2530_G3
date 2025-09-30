import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(32).trim().required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("ADMIN", "USER").default("USER")
});

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(8).required()
});
