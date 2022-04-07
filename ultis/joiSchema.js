const joi = require("joi");

module.exports = {
  schemaBody: {
    permit: {
      body: joi.object({
        name: joi.string().min(3).required(),
      }),
      patch: joi.object({
        name: joi.string().min(3),
      }),
    },
    role: {
      body: joi.object({
        name: joi.string().min(3).required(),
      }),
      patch: joi.object({
        name: joi.string().min(3),
      }),
    },
    user: {
      body: joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        phone: joi.string().required(),
        password: joi.string().required(),
      }),
      patch: joi.object({
        name: joi.string(),
        email: joi.string().email(),
        phone: joi.string(),
        password: joi.string(),
      }),
    },
  },
  schemaParams: {
    id: joi.object({
      id: joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
};
