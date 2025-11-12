const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Pengguna = require("../models/user.model");
const Resep = require("../models/resep.model");
const Bahan = require("../models/bahan.model"); 
const Langkah = require("../models/langkah.model");

exports.getAllResep = async(req, res) => {
    try{
        const resep = await Resep.findAll({
            include : [Bahan, Langkah],
            order : [["resep_id", "DESC"]],
        });
        res.status(200).json(resep);
    } catch (error){
        res.status(500).json({message:"Gagal mengambil data resep", error});
    }
};

exports.getResepById = async (req, res) => {
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

exports.createResep = async (req, res) => {
  const { judul, deskripsi,waktu_masak,porsi,foto, is_favorit, bahan, langkah,user_id } =
    req.body;

  try {
    const newResep = await Resep.create({
      judul,
      deskripsi,
      waktu_masak,
      porsi,
      foto,
      is_favorit,
      user_id,
    });

    // Tambahkan bahan
    if (Array.isArray(bahan) && bahan.length > 0) {
      await Promise.all(
        bahan.map((b) =>
          Bahan.create({
            resep_id: newResep.resep_id,
            nama_bahan: b.nama_bahan,
          })
        )
      );
    }

    // Tambahkan langkah
    if (Array.isArray(langkah) && langkah.length > 0) {
      await Promise.all(
        langkah.map((l, index) =>
          Langkah.create({
            resep_id: newResep.resep_id,
            urutan: index + 1,
            deskripsi: l.deskripsi,
          })
        )
      );
    }

    res.status(201).json({ message: "Resep berhasil ditambahkan", newResep });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan resep", errorDetail: error.toString() });
  }
};

exports.updateResep = async (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi,waktu_masak,porsi,foto, is_favorit, bahan, langkah,user_id } =
    req.body;

  try {
    const resep = await Resep.findByPk(id);
    if (!resep) return res.status(404).json({ message: "Resep tidak ditemukan" });

    // Update data resep utama
    await resep.update({ judul, deskripsi,waktu_masak,porsi,foto,is_favorit, bahan, langkah, user_id});

    // Hapus bahan & langkah lama, lalu buat ulang
    await Bahan.destroy({ where: { resep_id: id } });
    await Langkah.destroy({ where: { resep_id: id } });

    if (bahan && bahan.length > 0) {
      await Promise.all(
        bahan.map((b) =>
          Bahan.create({
            resep_id: id,
            nama_bahan: b.nama_bahan,
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
          })
        )
      );
    }

    res.status(200).json({ message: "Resep berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui resep", error });
  }
};

exports.deleteResep = async (req, res) => {
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

exports.toggleFavorit = async (req, res) => {
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
