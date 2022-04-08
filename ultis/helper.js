const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  fMsg: (res, msg = "", result = []) => {
    res.status(200).json({
      con: true,
      msg,
      result,
    });
  },
  encode: (payload) => bcrypt.hashSync(payload, 10),
  token: (payload) =>
    jwt.sign(payload, process.env.KEY, {
      expiresIn: "1h",
    }),
  compare: (plane, hash) => bcrypt.compareSync(plane, hash),
  decode: (payload) => jwt.decode(payload, process.env.KEY),
};
