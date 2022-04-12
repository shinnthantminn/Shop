const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("async-redis").createClient();
module.exports = {
  fMsg: (res, msg = "", result = []) => {
    res.status(200).json({
      con: true,
      msg,
      result,
    });
  },
  encode: (payload) => bcrypt.hashSync(payload, 10),
  compare: (plane, hash) => bcrypt.compareSync(plane, hash),
  token: (payload) =>
    jwt.sign(payload, process.env.KEY, {
      expiresIn: "1h",
    }),
  decode: (payload) => jwt.decode(payload, process.env.KEY),
  set: (id, value) => redis.set(id.toString(), JSON.stringify(value)),
  get: (id) => redis.get(id.toString()),
  del: (id) => redis.del(id.toString()),
};
