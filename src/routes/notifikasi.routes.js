const express = require("express");
const router = express.Router();
const notifikasiController = require("../controllers/notifikasi.controller");
const authenticateToken = require("../middleware/authenticateToken");

router.use(authenticateToken);

router.get("/", notifikasiController.getNotifikasiList);
router.post("/", notifikasiController.createNotifikasi);
router.put("/:id/read", notifikasiController.markAsRead);

module.exports = router;
