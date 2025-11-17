const Pengguna = require("../models/user.model");

const listUser = async (req, res, next) => {
  const users = await Pengguna.findAll({
    select: {
      user_id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.json(users).status(200);
};

const addUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await Pengguna.create({
      data: {
        username,
        email,
        password,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "User creation failed" });
  }
};

const editUser = async (req, res, next) => {
  const { user_id } = req.params;
  const { username, email, password } = req.body;
  try {
    const user = await Pengguna.update({
      where: { user_id: parseInt(user_id) },
      data: { username, email, password },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "User update failed" });
  }
};

const deleteUser = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    await Pengguna.delete({
      where: { user_id: parseInt(user_id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "User deletion failed" });
  }
};

module.exports = {
  listUser,
  addUser,
  editUser,
  deleteUser,
};