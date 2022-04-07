const router = require("express").Router();
const controller = require("../controllers/role");
const {
  validateParams,
  validateUnique,
  validateBody,
  validateUniquePermit,
} = require("../ultis/validator");
const { schemaBody, schemaParams } = require("../ultis/joiSchema");
const DB = require("../models/role");

router
  .route("/")
  .get(controller.all)
  .post(
    validateBody(schemaBody.role.body),
    validateUnique(DB, "name"),
    controller.add
  );

router.post("/add/permit", [validateUniquePermit(DB), controller.addPermit]);
router.delete("/remove/permit", [controller.removePermit]);

router
  .route("/:id")
  .get(validateParams(schemaParams.id, "id"), controller.get)
  .patch(
    validateBody(schemaBody.role.patch),
    validateParams(schemaParams.id, "id"),
    validateUnique(DB, "name"),
    controller.patch
  )
  .delete(validateParams(schemaParams.id, "id"), controller.drop);

module.exports = router;
