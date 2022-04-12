const helper = require("../ulits/helper");
const { object } = require("joi");

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = schema.validate(req.body);
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else next();
    };
  },
  validateParam: (schema, name) => {
    return (req, res, next) => {
      const obj = {};
      obj[name] = req.params[name];
      const result = schema.validate(obj);
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else next();
    };
  },
  validateUnique: (db, ...name) => {
    return async (req, res, next) => {
      const length = await db.find();
      if (length.length === 0) {
        next();
      } else {
        const num = [];
        name.map(async (i) => {
          const finder = {};
          finder[i] = req.body[i];
          const result = await db.findOne(finder);
          num.push(i);
          if (result) {
            next(new Error(`this ${i} was existing in our server`));
          } else if (name.length === num.length) {
            next();
          }
        });
      }
    };
  },
  validateToken: () => {
    return async (req, res, next) => {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const decoder = helper.decode(token);
        const user = await helper.get(decoder._id);
        if (user) {
          req.user = JSON.parse(user);
          next();
        } else next(new Error("Tokenization Error"));
      } else next(new Error("Tokenization Error"));
    };
  },
  validateRole: (...role) => {
    return (req, res, next) => {
      console.log(req.user);
      const num = [];
      for (let i = 0; i < role.length; i++) {
        const check = req.user.role.find((j) => j.name === role[i]);
        num.push(i);
        if (check) {
          next();
          break;
        } else if (num.length === role.length)
          next(new Error("you have no permission to do that"));
      }
    };
  },
  validateRoleV2: (...role) => {
    return (req, res, next) => {
      const nameRole = req.user.role.map((i) => i.name);
      const finder = role.some((i) => nameRole.includes(i));
      if (finder) {
        next();
      } else next(new Error("you have no permission to do that"));
    };
  },
};
