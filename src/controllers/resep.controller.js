const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Resep = require("../models/resep.model");
const Bahan = require("../models/bahan.model"); 
const Langkah = require("../models/langkah.model");
const { Op } = require("sequelize");

const getAllResep = async (req, res) => {
  try {
    const { search } = req.query;

    const whereClause = {};
    if (search) {
      whereClause.judul = { [Op.like]: `%${search}%` };
    }

    const resep = await Resep.findAll({
      where: whereClause,
      include: [Bahan, Langkah],
      order: [["id", "DESC"]],
    });

    res.status(200).json(resep);
  } catch (error) {
    console.error("getAllResep error:", error);
    res.status(500).json({ message: "Gagal mengambil data resep", error });
  }
};

const getResepById = async (req, res) => {
  try {
    const { id } = req.params;
    const resep = await Resep.findByPk(id, {
      include: [Bahan, Langkah],
    });

    if (!resep) {
      return res.status(404).json({ message: "Resep tidak ditemukan" });
    }

    res.status(200).json(resep);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil resep", error });
  }
};

const createResep = async (req, res) => {
const { judul, waktu_masak, porsi, foto, is_favorit, bahan, langkah } = req.body;
const userId = req.user.user_id; 

  try {
    const newResep = await Resep.create({
      judul,
      waktu_masak,
      porsi,
      foto,
      is_favorit,
      user_id: userId,   
    });

    
    if (Array.isArray(bahan) && bahan.length > 0) {
      await Promise.all(
        bahan.map((b) =>
          Bahan.create({
            resep_id: newResep.id,
            nama_bahan: b.nama_bahan,
            jumlah: b.jumlah, 
            satuan: b.satuan
          })
        )
      );
    }

    
    if (Array.isArray(langkah) && langkah.length > 0) {
      await Promise.all(
        langkah.map((l, index) =>
          Langkah.create({
            resep_id: newResep.id,
            urutan: index + 1,
            deskripsi: l.deskripsi,
            foto_langkah: l.foto_langkah || null,
          })
        )
      );
    }

    res.status(201).json({ message: "Resep berhasil ditambahkan", newResep });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan resep", errorDetail: error.toString() });
  }
};

const updateResep = async (req, res) => {
  const { id } = req.params;
  const { judul,waktu_masak,porsi,foto, is_favorit, bahan, langkah,user_id } = req.body;

  try {
    const resep = await Resep.findByPk(id);
    if (!resep) return res.status(404).json({ message: "Resep tidak ditemukan" });

    
    await resep.update({ 
      judul, 
      waktu_masak,
      porsi,
      foto,
      is_favorit, 
      bahan, 
      langkah, 
      user_id});

    
    await Bahan.destroy({ where: { resep_id: id } });
    await Langkah.destroy({ where: { resep_id: id } });

    if (bahan && bahan.length > 0) {
      await Promise.all(
        bahan.map((b) =>
          Bahan.create({
            resep_id: id,
            nama_bahan: b.nama_bahan,
            jumlah: b.jumlah, 
            satuan: b.satuan
          })
        )
      );
    }

    if (langkah && langkah.length > 0) {
      await Promise.all(
        langkah.map((l, index) =>
          Langkah.create({
            resep_id: id,
            urutan: index + 1,
            deskripsi: l.deskripsi,
            foto_langkah: l.foto_langkah || null,
          })
        )
      );
    }

    res.status(200).json({ message: "Resep berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui resep", error });
  }
};

const deleteResep = async (req, res) => {
  try {
    const { id } = req.params;
    const resep = await Resep.findByPk(id);

    if (!resep) return res.status(404).json({ message: "Resep tidak ditemukan" });

    await resep.destroy();
    res.status(200).json({ message: "Resep berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus resep", error });
  }
};

const toggleFavorit = async (req, res) => {
  try {
    const { id } = req.params;
    const resep = await Resep.findByPk(id);

    if (!resep) return res.status(404).json({ message: "Resep tidak ditemukan" });

    resep.is_favorit = !resep.is_favorit;
    await resep.save();

    res.status(200).json({
      message: resep.is_favorit
        ? "Resep ditambahkan ke favorit"
        : "Resep dihapus dari favorit",
      resep,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengubah status favorit", error });
  }
};

const getFavoritResep = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const resep = await Resep.findAll({
      where: { user_id: userId, is_favorit: 1 },
      include: [Bahan, Langkah],
      order: [["id", "DESC"]],
    });
    res.status(200).json(resep);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil resep favorit", error });
  }
};

module.exports = {
  getAllResep,
  getResepById,
  createResep,
  updateResep,
  deleteResep,
  toggleFavorit,
  getFavoritResep,
};
