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
    addPermit: joi.object({
      roleId: joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      permitId: joi
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
    user: {
      body: joi.object({
        name: joi.string().min(3).required(),
        email: joi.string().email().required(),
        phone: joi.string().min(3).required(),
        password: joi.string().min(3).required(),
      }),
      login: joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(3).required(),
      }),
      patch: joi.object({
        name: joi.string().min(3),
        email: joi.string().email(),
        phone: joi.string().min(3),
        password: joi.string().min(3),
      }),
      role: joi.object({
        userId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        roleId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
      }),
      permit: joi.object({
        userId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        permitId: joi
          .string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
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
