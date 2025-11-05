import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(32).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("ADMIN", "USER").optional()
});

<<<<<<< HEAD

=======
>>>>>>> 1d0cf8577854c100faed4b397030d26f37c95c38
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});