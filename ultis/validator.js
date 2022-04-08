const { decode } = require("./helper");
const { get } = require("./Redis");
module.exports = {
  validateBody: (schema) => {
    return async (req, res, next) => {
      const result = await schema.validate(req.body);
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else next();
    };
  },
  validateToken: () => {
    return async (req, res, next) => {
      const token = req.headers.authorization;
      if (token) {
        const user = decode(token.split(" ")[1]);
        const person = await get(user._id);
        if (person) {
          req.user = person;
          next();
        } else next(new Error("Tokenization Error"));
      } else next(new Error("Tokenization Error"));
    };
  },
  validateUnique: (db, ...arr) => {
    return async (req, res, next) => {
      const item = await db.find();
      if (item.length === 0) {
        next();
      } else {
        const num = [];
        arr.map(async (i) => {
          const finder = {};
          finder[i] = req.body[i];
          const result = await db.findOne(finder);
          num.push(i);
          if (result) {
            next(new Error(`this ${i} was use in our server`));
          } else if (num.length === arr.length) {
            next();
          }
        });
      }
    };
  },
  validateParams: (schema, name) => {
    return async (req, res, next) => {
      const obj = {};
      obj[name] = req.params[name];
      const result = await schema.validate(obj);
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else next();
    };
  },
  validateRole: (role) => {
    return (req, res, next) => {
      const user = JSON.parse(req.user);
      const check = user.role.find((i) => i.name === role);
      if (check) {
        next();
      } else next(new Error("you have no permission"));
    };
  },
};
