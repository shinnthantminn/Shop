const router = require("express").Router();
const controller = require("../controllers/user");
const {
  validateBody,
  validateUnique,
  validateToken,
  validateRole,
  validateRoleV2,
} = require("../ulits/validator");
const { schemaBody } = require("../ulits/joiSchema");
const userDB = require("../model/user");

router
  .route("/")
  .get(controller.all)
  .post(validateBody(schemaBody.user.login), controller.login);

router.post("/register", [
  validateBody(schemaBody.user.body),
  validateUnique(userDB, "email", "phone"),
  controller.register,
]);

router.post("/add/role", [
  validateBody(schemaBody.user.role),
  validateToken(),
  validateRole("CFO", "CEO"),
  controller.addRole,
]);

router.delete("/remove/role", [
  validateBody(schemaBody.user.role),
  validateToken(),
  validateRoleV2("CFO", "CEO"),
  controller.removeRole,
]);

router.post("/add/permit", [
  validateBody(schemaBody.user.permit),
  validateToken(),
  validateRoleV2("CEO", "CFO", "Manager"),
  controller.addPermit,
]);

router.delete("/remove/permit", [
  validateBody(schemaBody.user.permit),
  validateToken(),
  validateRoleV2("CEO", "CFO", "Manager"),
  controller.removePermit,
]);

module.exports = router;
