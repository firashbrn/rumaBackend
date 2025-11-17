const express = require("express");
const resepController = require("../controllers/resep.controller");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/", authenticateToken,resepController.getAllResep);
router.get("/:id",authenticateToken, resepController.getResepById);
router.post("/", authenticateToken, resepController.createResep);
router.put("/:id",authenticateToken, resepController.updateResep);
router.delete("/:id",authenticateToken, resepController.deleteResep);
router.patch("/:id/favorit", authenticateToken, resepController.toggleFavorit);

module.exports = router;