const express = require ("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");
const userController = require("../controllers/user.controller");
const uploadProfile = require("../middlewares/uploadProfile");
const userController = require("../controllers/user.controller");

router.get("/", authenticateToken, userController.listUser);
router.post("/", authenticateToken, userController.addUser);
router.put("/:id", authenticateToken, userController.editUser);
router.delete("/:id", authenticateToken, userController.deleteUser);
router.put("/:id", authenticateToken, uploadProfile.single("foto_profil"), userController.updateProfile );

module.exports = router;