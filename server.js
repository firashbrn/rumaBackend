// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./src/config/db");
const authRouter = require("./src/routes/auth.route");
const resepRouter = require("./src/routes/resep.route")

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/resep", resepRouter);

sequelize.sync()
  .then(() => console.log("Sequelize sync completed (tidak menghapus tabel)."))
  .catch(err => console.error("Sequelize sync error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
