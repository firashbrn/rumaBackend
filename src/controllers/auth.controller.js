
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Pengguna = require("../models/user.model");
const dotenv = require("dotenv");
dotenv.config();

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const existingUser = await Pengguna.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Pengguna.create({
      username: username || email.split("@")[0],
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error register:", error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; 

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

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
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      status: "Success",
      message: "Login berhasil",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        foto_profil: user.foto_profil,
      },
    });
  } catch (error) {
    console.error("Error login:", error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};
