const DB = require("../models/role");
const permitDB = require("../models/permit");
const { fMsg } = require("../ultis/helper");

module.exports = {
  all: async (req, res, next) => {
    const role = await DB.find().populate("permit", "-created -__v -_id");
    fMsg(res, "all role", role);
  },
  add: async (req, res, next) => {
    await new DB(req.body).save();
    const role = await DB.find();
    fMsg(res, "add role complete", role);
  },
  get: async (req, res, next) => {
    const role = await DB.findById(req.params.id);
    role
      ? fMsg(res, "this role", role)
      : next(new Error("no role with that id"));
  },
  patch: async (req, res, next) => {
    const role = await DB.findById(req.params.id);
    if (role) {
      await DB.findByIdAndUpdate(role._id, req.body);
      const newRole = await DB.findById(req.params.id);
      fMsg(res, "role update complete", newRole);
    } else next(new Error("no role with that id"));
  },
  drop: async (req, res, next) => {
    const role = await DB.findById(req.params.id);
    if (role) {
      await DB.findByIdAndRemove(role._id);
      fMsg(res, "role drop complete");
    } else next(new Error("no role with that id"));
  },
  addPermit: async (req, res, next) => {
    const roleId = await DB.findById(req.body.roleId);
    const permitId = await permitDB.findById(req.body.permitId);
    if (roleId && permitId) {
      await DB.findByIdAndUpdate(roleId._id, {
        $push: { permit: permitId._id },
      });
      const role = await DB.find().populate("permit", "-__v -_id -created");
      fMsg(res, "permit Add Complete", role);
    } else next(new Error("something was wrong"));
  },
  removePermit: async (req, res, next) => {
    const roleId = await DB.findById(req.body.roleId);
    const permitId = await permitDB.findById(req.body.permitId);
    if (roleId && permitId) {
      await DB.findByIdAndUpdate(roleId._id, {
        $pull: { permit: permitId._id },
      });
      const role = await DB.find().populate("permit", "-__v -_id -created");
      fMsg(res, "permit remove Complete", role);
    } else next(new Error("something was wrong"));
  },
};
