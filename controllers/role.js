const helper = require("../ulits/helper");
const DB = require("../model/role");
const permitDB = require("../model/permit");
const e = require("express");

module.exports = {
  all: async (req, res, next) => {
    const role = await DB.find().populate("permit", "-_v -create");
    helper.fMsg(res, "all role from server", role);
  },
  add: async (req, res, next) => {
    await new DB(req.body).save();
    const role = await DB.find();
    helper.fMsg(res, "add role to server", role);
  },
  get: async (req, res, next) => {
    const role = await DB.findById(req.params.id).populate(
      "permit",
      "-_v -create"
    );
    role
      ? helper.fMsg(res, "single get role from server", role)
      : next(new Error("no role with that id"));
  },
  patch: async (req, res, next) => {
    const role = await DB.findById(req.params.id);
    if (role) {
      await DB.findByIdAndUpdate(role._id, req.body);
      const newRole = await DB.find().populate("permit", "-_v -create");
      helper.fMsg(res, "role update complete", newRole);
    }
    next(new Error("no role with that id"));
  },
  drop: async (req, res, next) => {
    const role = await DB.findById(req.params.id);
    if (role) {
      await DB.findByIdAndDelete(role._id);
      const deleteRole = await DB.find();
      helper.fMsg(res, "role update complete", deleteRole);
    }
    next(new Error("no role with that id"));
  },
  addPermit: async (req, res, next) => {
    const roleId = await DB.findById(req.body.roleId);
    const permitId = await permitDB.findById(req.body.permitId);
    if (permitId && roleId) {
      const check = roleId.permit.find((i) => i.equals(permitId._id));
      if (check) {
        next(new Error("this permit was existing in this role"));
      } else {
        const addPermit = await DB.findByIdAndUpdate(roleId._id, {
          $push: { permit: permitId._id },
        });
        const role = await DB.find().populate("permit", "-_v -create");
        helper.fMsg(res, "add role complete", role);
      }
    } else next(new Error("something was wrong"));
  },
  removePermit: async (req, res, next) => {
    const roleId = await DB.findById(req.body.roleId);
    if (roleId) {
      await DB.findByIdAndUpdate(roleId._id, {
        $pull: { permit: req.body.permitId },
      });
      const role = await DB.findById(roleId._id).populate(
        "permit",
        "-_v -create"
      );
      helper.fMsg(res, "remove permit complete", role);
    } else next(new Error("no role with that id"));
  },
};
