
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./src/config/db");

dotenv.config();
const app = express();

const authRouter = require("./src/routes/auth.route");
const resepRouter = require("./src/routes/resep.route")
const agendaRouter = require("./src/routes/agenda.route"); 
const notifikasiRouter = require("./src/routes/notifikasi.routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/resep", resepRouter);
app.use("/api/agenda", agendaRouter);
app.use("/api/notifikasi", notifikasiRouter);
app.use("/api/shopping-lists", require("./src/routes/shoppingList.route"));

sequelize.sync()
  .then(() => 
  .catch(err => console.error("Sequelize sync error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 

