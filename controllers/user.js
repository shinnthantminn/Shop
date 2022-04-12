const DB = require("../model/user");
const roleDB = require("../model/role");
const permitDB = require("../model/permit");
const helper = require("../ulits/helper");

module.exports = {
  all: async (req, res, next) => {
    const user = await DB.find().populate("role permit", "-__v -created");
    helper.fMsg(res, "all user from server", user);
  },
  register: async (req, res, next) => {
    req.body.password = helper.encode(req.body.password);
    const newUser = await new DB(req.body).save();
    helper.fMsg(res, "register complete", newUser);
  },
  login: async (req, res, next) => {
    const result = await DB.findOne({ email: req.body.email }).populate(
      "role permit",
      "-created -__v "
    );
    if (result) {
      if (helper.compare(req.body.password, result.password)) {
        const data = result.toObject();
        delete data.password;
        data.token = helper.token(data);
        helper.set(data._id, data);
        helper.fMsg(res, "login successfull", data);
      } else next(new Error("password Wrong"));
    } else next(new Error("this email was not existing in our server"));
  },
  addRole: async (req, res, next) => {
    const roleId = await roleDB.findById(req.body.roleId);
    const userId = await DB.findById(req.body.userId);
    if (roleId && userId) {
      const check = userId.role.find((i) => i.equals(roleId._id));
      if (check) {
        next(new Error("this role was existing in our server"));
      } else {
        await DB.findByIdAndUpdate(userId._id, {
          $push: { role: roleId._id },
        });
        const addRole = await DB.findById(userId._id).populate(
          "role permit",
          "-__v"
        );
        helper.fMsg(res, "role added complete", addRole);
      }
    } else next(new Error("something was wrong"));
  },
  removeRole: async (req, res, next) => {
    const userId = await DB.findById(req.body.userId);

    if (userId) {
      await DB.findByIdAndUpdate(userId._id, {
        $pull: { role: req.body.roleId },
      });
      const newUser = await DB.findById(userId._id);
      helper.fMsg(res, "remove role complete", newUser);
    } else next(new Error("no user whit that userId"));
  },
  addPermit: async (req, res, next) => {
    const userId = await DB.findById(req.body.userId);
    const permitId = await permitDB.findById(req.body.permitId);
    if (userId && permitId) {
      const finder = userId.permit.find((i) => i.equals(permitId._id));
      if (finder) {
        next(new Error("this permit was existing in our server"));
      } else {
        await DB.findByIdAndUpdate(userId._id, {
          $push: { permit: permitId._id },
        });
        const user = await DB.find(userId._id).populate(
          "role permit",
          "-__v -created"
        );
        helper.fMsg(res, "permit add complete", user);
      }
    } else next(new Error("something was wrong"));
  },
  removePermit: async (req, res, next) => {
    const user = await DB.findById(req.body.userId);
    if (user) {
      await DB.findByIdAndUpdate(user._id, {
        $pull: { permit: req.body.permitId },
      });
      const newUser = await DB.findById(user._id).populate(
        "role permit",
        "-__v -created"
      );
      console.log(newUser);
      helper.fMsg(res, "permit remove complete", newUser);
    } else next(new Error("no your found"));
  },
};
