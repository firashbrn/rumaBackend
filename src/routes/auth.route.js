
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authenticateToken = require("../middleware/authenticateToken");
const Pengguna  = require("../models/user.model");

router.post("/register", authController.register);
router.post("/login",  authController.login);
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await Pengguna.findByPk(req.user.user_id, {
      attributes: ["user_id", "username", "email", "foto_profil"],
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error get profile:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

module.exports = router;
