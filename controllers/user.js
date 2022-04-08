const DB = require("../models/user");
const roleDB = require("../models/role");
const permitDB = require("../models/permit");
const { fMsg, encode, compare, token } = require("../ultis/helper");
const { set } = require("../ultis/Redis");

module.exports = {
  register: async (req, res, next) => {
    req.body.password = encode(req.body.password);
    await new DB(req.body).save();
    const user = await DB.find();
    fMsg(res, "register Complete", user);
  },
  login: async (req, res, next) => {
    const user = await DB.findOne({ email: req.body.email })
      .populate("role permit")
      .select("-__v");
    if (user) {
      if (compare(req.body.password, user.password)) {
        const data = user.toObject();
        delete data.password;
        data.token = token(data);
        await set(data._id, data);
        fMsg(res, "login successful", data);
      } else next(new Error("this password is wrong"));
    } else next(new Error("this email wasn't register"));
  },
  addRole: async (req, res, next) => {
    const user = await DB.findById(req.body.userId);
    const role = await roleDB.findById(req.body.roleId);
    const check = user.role.find((i) => i.equals(role._id));
    if (check) {
      next(new Error("this role is exist"));
    } else {
      if (user && role) {
        await DB.findByIdAndUpdate(user._id, {
          $push: { role: role._id },
        });
        const roleAdded = await DB.findById(user._id).populate("role", "-__v");
        fMsg(res, "role add complete", roleAdded);
      }
      next(new Error("something was wrong"));
    }
  },
  removeRole: async (req, res, next) => {
    const user = await DB.findById(req.body.userId);

    const check = user.role.find((i) => i.equals(req.body.roleId));
    if (check) {
      await DB.findByIdAndUpdate(user._id, {
        $pull: { role: req.body.roleId },
      });
      const roleRemove = await DB.findById(user._id);
      fMsg(res, "role remove complete", roleRemove);
    } else next(new Error("this role is doesn't exist"));
  },
  addPermit: async (req, res, next) => {
    const user = await DB.findById(req.body.userId);
    const permit = await permitDB.findById(req.body.permitId);
    const check = user.permit.find((i) => i.equals(permit._id));
    if (check) {
      next(new Error("this permit was exist"));
    } else {
      if (user && permit) {
        await DB.findByIdAndUpdate(user._id, { $push: { permit: permit._id } });
        const newUser = await DB.findById(req.body.userId).populate(
          "permit",
          "-__v"
        );
        fMsg(res, "permit add Complete", newUser);
      } else next(new Error("something Error"));
    }
  },
  removePermit: async (req, res, next) => {
    const user = await DB.findById(req.body.userId);
    const check = user.permit.find((i) => i.equals(req.body.permitId));

    if (check) {
      await DB.findByIdAndUpdate(user._id, {
        $pull: { permit: req.body.permitId },
      });
      const newUser = await DB.findById(req.body.userId);
      fMsg(res, "permit remove Complete", newUser);
    } else next(new Error("this permit doesn't exist"));
  },
};
