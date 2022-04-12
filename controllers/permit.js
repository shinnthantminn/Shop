const helper = require("../ulits/helper");
const DB = require("../model/permit");

module.exports = {
  all: async (req, res, next) => {
    const permit = await DB.find();
    helper.fMsg(res, "all permit from server", permit);
  },
  add: async (req, res, next) => {
    await new DB(req.body).save();
    const permit = await DB.find();
    helper.fMsg(res, "permit add complete", permit);
  },
  get: async (req, res, next) => {
    const permit = await DB.findById(req.params.id);
    permit
      ? helper.fMsg(res, "single get permit complete", permit)
      : next(new Error("no permit with that id"));
  },
  patch: async (req, res, next) => {
    const permit = await DB.findById(req.params.id);
    if (permit) {
      await DB.findByIdAndUpdate(permit._id, req.body);
      const newPermit = await DB.findById(permit._id);
      helper.fMsg(res, "update permit complete", newPermit);
    }
    next(new Error("no permit with that id"));
  },
  drop: async (req, res, next) => {
    const permit = await DB.findById(req.params.id);
    if (permit) {
      await DB.findByIdAndDelete(permit._id);
      const DeletePermit = await DB.find();
      helper.fMsg(res, "update permit complete", DeletePermit);
    }
    next(new Error("no permit with that id"));
  },
};
