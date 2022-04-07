const DB = require("../models/permit");
const { fMsg } = require("../ultis/helper");

module.exports = {
  all: async (req, res, next) => {
    const permit = await DB.find();
    fMsg(res, "all permit from Server", permit);
  },
  add: async (req, res, next) => {
    await new DB(req.body).save();
    const permit = await DB.find();
    fMsg(res, "permit Added", permit);
  },
  get: async (req, res, next) => {
    const permit = await DB.findById(req.params.id);
    permit
      ? fMsg(res, "this permit ?", permit)
      : next(new Error("No Permit with that id"));
  },
  patch: async (req, res, next) => {
    const permit = await DB.findById(req.params.id);
    if (permit) {
      await DB.findByIdAndUpdate(permit._id, req.body);
      const newPermit = await DB.findById(permit._id);
      fMsg(res, "permit update complete", newPermit);
    }
    next(new Error("No Permit with that id"));
  },
  drop: async (req, res, next) => {
    const permit = await DB.findById(req.params.id);
    if (permit) {
      await DB.findByIdAndDelete(permit._id);
      fMsg(res, "permit delete complete complete");
    }
    next(new Error("No Permit with that id"));
  },
};
