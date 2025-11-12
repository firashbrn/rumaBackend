const express = require("express");
const { getAllResep, getResepById, createResep, updateResep, deleteResep, toggleFavorit, } = require("../controllers/resep.controller");
const router = express.Router();

router.get("/", getAllResep);
router.get("/:id", getResepById);
router.post("/", createResep);
router.put("/:id", updateResep);
router.delete("/:id", deleteResep);
router.patch("/:id/favorit", toggleFavorit);

module.exports = router;