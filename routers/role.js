const router = require("express").Router();
const controller = require("../controllers/role");
const {
  validateUnique,
  validateParam,
  validateBody,
  validateRoleV2,
  validateToken,
} = require("../ulits/validator");
const { schemaParams, schemaBody } = require("../ulits/joiSchema");
const DB = require("../model/role");

router
  .route("/")
  .get(controller.all)
  .post(
    validateToken(),
    validateRoleV2("CEO"),
    validateBody(schemaBody.role.body),
    validateUnique(DB, "name"),
    controller.add
  );

router
  .route("/:id")
  .get(validateParam(schemaParams.id, "id"), controller.get)
  .patch(
    validateBody(schemaBody.role.patch),
    validateUnique(DB, "name"),
    validateToken(),
    validateRoleV2("CEO"),
    validateParam(schemaParams.id, "id"),
    controller.patch
  )
  .delete(
    validateParam(schemaParams.id, "id"),
    validateToken(),
    validateRoleV2("CEO"),
    controller.drop
  );

router.post("/add/permit", [
  validateBody(schemaBody.addPermit),
  validateToken(),
  validateRoleV2("CEO"),
  controller.addPermit,
]);

router.delete("/remove/permit", [
  validateBody(schemaBody.addPermit),
  validateToken(),
  validateRoleV2("CEO"),
  controller.removePermit,
]);

module.exports = router;
