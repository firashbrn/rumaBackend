const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Pengguna = require("../models/user.model");

// 🔹 REGISTER USER
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await Pengguna.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split("@")[0];

    await Pengguna.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (error) {
    console.error("Error register:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// 🔹 LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Pengguna.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      "rahasiaSuperAman",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      status : "Login Berhasil",
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
