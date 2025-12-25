const express = require("express");
const router = express.Router();
const controller = require("../controllers/shoppingList.controller");

router.post("/", controller.createList);
router.get("/", controller.getAll);
router.get("/:id", controller.getDetail);

router.post("/categories", controller.createCategory);
router.post("/items", controller.createItem);
router.put("/items/:id", controller.updateItem);

module.exports = router;