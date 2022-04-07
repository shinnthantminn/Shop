module.exports = {
  validateBody: (schema) => {
    return async (req, res, next) => {
      const result = await schema.validate(req.body);
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else next();
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
  validateUniquePermit: (db) => {
    return async (req, res, next) => {
      const item = await db.findById(req.body.roleId);
      if (item.permit.length === 0) {
        next();
      } else {
        const num = [];
        item.permit.map((i) => {
          const permit = i.toString();
          num.push(permit);
          if (req.body.permitId === permit) {
            next(new Error("this permit was already in use"));
          } else if (num.length === item.permit.length) {
            next();
          }
        });
      }
    };
  },
};
