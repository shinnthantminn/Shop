const router = require("express").Router();
const controller = require("../controllers/permit");
const {
  validateBody,
  validateUnique,
  validateParams,
} = require("../ultis/validator");
const { schemaBody, schemaParams } = require("../ultis/joiSchema");
const DB = require("../models/permit");

router
  .route("/")
  .get(controller.all)
  .post(
    validateBody(schemaBody.permit.body),
    validateUnique(DB, "name"),
    controller.add
  );

router
  .route("/:id")
  .get(validateParams(schemaParams.id, "id"), controller.get)
  .patch(
    validateBody(schemaBody.permit.patch),
    validateUnique(DB, "name"),
    validateParams(schemaParams.id, "id"),
    controller.patch
  )
  .delete(validateParams(schemaParams.id, "id"), controller.drop);

module.exports = router;
