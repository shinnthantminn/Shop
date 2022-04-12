const router = require("express").Router();
const controller = require("../controllers/permit");
const {
  validateUnique,
  validateBody,
  validateParam,
  validateRoleV2,
  validateToken,
} = require("../ulits/validator");
const { schemaBody, schemaParams } = require("../ulits/joiSchema");
const DB = require("../model/permit");

router
  .route("/")
  .get(controller.all)
  .post(
    validateBody(schemaBody.permit.body),
    validateUnique(DB, "name"),
    validateToken(),
    validateRoleV2("CEO"),
    controller.add
  );

router
  .route("/:id")
  .get(validateParam(schemaParams.id, "id"), controller.get)
  .patch(
    validateParam(schemaParams.id, "id"),
    validateBody(schemaBody.permit.patch),
    validateToken(),
    validateRoleV2("CEO"),
    validateUnique(DB, "name"),
    controller.patch
  )
  .delete(
    validateParam(schemaParams.id, "id"),
    validateToken(),
    validateRoleV2("CEO"),
    controller.drop
  );

module.exports = router;
