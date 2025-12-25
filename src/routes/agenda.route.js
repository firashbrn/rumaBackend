const express = require("express");
const router = express.Router();
const agendaController = require("../controllers/agenda.controller");
const authenticateToken = require("../middleware/authenticateToken");

router.use(authenticateToken);

router.post("/", agendaController.createAgenda);
router.get("/", agendaController.getAllAgendas);
router.get("/:id", agendaController.getAgendaDetail);
router.put("/:id", agendaController.updateAgenda);
router.delete("/:id", agendaController.deleteAgenda);

module.exports = router;
