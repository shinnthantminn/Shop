const router = require("express").Router();
const controller = require("../controllers/user");
const { schemaParams, schemaBody } = require("../ultis/joiSchema");
const {
  validateParams,
  validateBody,
  validateUnique,
  validateToken,
  validateRole,
  validateUniquePermit,
} = require("../ultis/validator");
const DB = require("../models/user");

router.route("/").get().post(validateBody(schemaBody.login), controller.login);

router.post("/register", [
  validateUnique(DB, "name", "email", "phone"),
  validateBody(schemaBody.user.body),
  controller.register,
]);

router.post("/add/role", [
  validateToken(),
  validateRole("CEO"),
  validateBody(schemaBody.user.addRole),
  controller.addRole,
]);

router.delete("/remove/role", [
  validateToken(),
  validateRole("CEO"),
  validateBody(schemaBody.user.addRole),
  controller.removeRole,
]);

router.post("/add/permit", [
  validateToken(),
  validateRole("CEO"),
  validateBody(schemaBody.user.addPermit),
  controller.addPermit,
]);

router.delete("/remove/permit", [
  validateToken(),
  validateRole("CEO"),
  validateBody(schemaBody.user.addPermit),
  controller.removePermit,
]);

router.route("/:id").get().patch().delete();

module.exports = router;
