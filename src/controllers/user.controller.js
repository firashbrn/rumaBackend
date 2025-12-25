
const Pengguna = require("../models/user.model");

const listUser = async (req, res) => {
  try {
    const users = await Pengguna.findAll({
      attributes: ["user_id", "username", "email", "foto_profil", "created_at"],
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Gagal mengambil data user" });
  }
};

const addUser = async (req, res) => {
  try {
    const { username, email, password, foto_profil } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Pengguna.create({
      username,
      email,
      password: hashedPassword,
      foto_profil,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "User creation failed" });
  }
};

   

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await Pengguna.destroy({ where: { user_id: id } });
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "User deletion failed" });
  }
};

async function updateProfile(req, res) {
  try {
    const { username, email, password } = req.body;
    const { id } = req.params;
    

    
    if (parseInt(id, 10) !== req.user.user_id) {
      return res.status(403).json({ message: "Tidak boleh edit user lain" });
    }

    const user = await Pengguna.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        updates.password = hashed;
      }

    
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      updates.foto_profil = `${baseUrl}/uploads/profile/${req.file.filename}`;
    }

    await user.update(updates);

    return res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      foto_profil: user.foto_profil,
    });
  } catch (err) {
    console.error("Error update profile:", err);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: err.message });
  }
}

module.exports = { listUser, addUser,  deleteUser, updateProfile };
