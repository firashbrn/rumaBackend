const express = require("express");
const router = express.Router();
const controller = require("../controllers/tagihan.controller");
const authenticateToken = require('../middleware/authenticateToken');
const upload = require("../middleware/upload");

router.get("/", authenticateToken, controller.getAllTagihan);
router.get("/:id", authenticateToken, controller.getTagihanById);
router.post("/", authenticateToken, controller.createTagihan);
router.put("/:id", authenticateToken, controller.updateTagihan);
router.delete("/:id", authenticateToken, controller.deleteTagihan);

router.put("/:id/lunas", authenticateToken, upload.single("bukti_foto"), controller.tandaiLunas);

router.put("/:id/status", authenticateToken, controller.updateStatus);
router.put("/:id/foto", authenticateToken, upload.single("bukti_foto"), controller.updateFoto);

module.exports = router;
