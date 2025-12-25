const Tagihan = require("../models/tagihan.model");

const getAllTagihan = async (req, res) => {
  try {
    const tagihan = await Tagihan.findAll({
      where: { user_id: req.user.user_id || req.user.id },
      order: [["tagihan_id", "DESC"]],
    });
    res.status(200).json(tagihan);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil tagihan", error });
  }
};

const getTagihanById = async (req, res) => {
  try {
    const tagihan = await Tagihan.findOne({
      where: {
        tagihan_id: req.params.id,
        user_id: req.user.user_id || req.user.id,
      },
    });

    if (!tagihan) {
      return res.status(404).json({ message: "Tagihan tidak ditemukan" });
    }

    res.status(200).json(tagihan);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil tagihan", error });
  }
};

const createTagihan = async (req, res) => {
  try {
    
    

    const newTagihan = await Tagihan.create({
      ...req.body,
      user_id: req.user.user_id || req.user.id, 
    });

    
    res.status(201).json({ message: "Tagihan berhasil ditambahkan", newTagihan });
  } catch (error) {
    console.error("❌ Error creating tagihan:", error);
    res.status(500).json({ message: "Gagal menambahkan tagihan", error });
  }
};

const updateTagihan = async (req, res) => {
  try {
    const tagihan = await Tagihan.findOne({
      where: { tagihan_id: req.params.id, user_id: req.user.user_id || req.user.id },
    });

    if (!tagihan) {
      return res.status(404).json({ message: "Tagihan tidak ditemukan" });
    }

    const {
      judul,
      deskripsi,
      jatuh_tempo,
      reminder_days,
      repeat_type,
      status,
      tanggal_selesai,
      bukti_foto,
    } = req.body;

    
    const updateData = {};
    if (judul !== undefined) updateData.judul = judul;
    if (deskripsi !== undefined) updateData.deskripsi = deskripsi;
    if (jatuh_tempo !== undefined) updateData.jatuh_tempo = jatuh_tempo;
    if (reminder_days !== undefined) updateData.reminder_days = reminder_days;
    if (repeat_type !== undefined) updateData.repeat_type = repeat_type;
    if (status !== undefined) updateData.status = status;
    if (tanggal_selesai !== undefined) updateData.tanggal_selesai = tanggal_selesai ? new Date(tanggal_selesai) : null;
    if (bukti_foto !== undefined) updateData.bukti_foto = bukti_foto;

    await tagihan.update(updateData);

    res.status(200).json({ message: "Tagihan berhasil diperbarui", data: tagihan });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui tagihan", error });
  }
};

const deleteTagihan = async (req, res) => {
  try {
    const tagihan = await Tagihan.findOne({
      where: { tagihan_id: req.params.id, user_id: req.user.user_id || req.user.id },
    });

    if (!tagihan) {
      return res.status(404).json({ message: "Tagihan tidak ditemukan" });
    }

    await tagihan.destroy();
    res.status(200).json({ message: "Tagihan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus tagihan", error });
  }
};

const tandaiLunas = async (req, res) => {
  try {
    const tagihan = await Tagihan.findOne({
      where: { tagihan_id: req.params.id, user_id: req.user.user_id || req.user.id },
    });

    if (!tagihan) {
      return res.status(404).json({ message: "Tagihan tidak ditemukan" });
    }

    let buktiFotoPath = tagihan.bukti_foto;
    if (req.file) {
      
      
      buktiFotoPath = "uploads/" + req.file.filename;
    }

    await tagihan.update({
      status: "lunas",
      bukti_foto: buktiFotoPath,
      tanggal_selesai: req.body.tanggal_selesai ? new Date(req.body.tanggal_selesai) : new Date(),
    });

    res.status(200).json({ message: "Tagihan berhasil ditandai lunas", data: tagihan });
  } catch (error) {
    console.error("Error marking tagihan lunas:", error);
    res.status(500).json({ message: "Gagal menandai lunas", error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const tagihan = await Tagihan.findOne({
      where: { tagihan_id: req.params.id, user_id: req.user.user_id || req.user.id },
    });

    if (!tagihan) {
      return res.status(404).json({ message: "Tagihan tidak ditemukan" });
    }

    const { status, tanggal_selesai, clear_foto } = req.body;

    const updateData = { status };

    
    if (status === "lunas") {
      updateData.tanggal_selesai = tanggal_selesai ? new Date(tanggal_selesai) : new Date();
    }

    
    if (status === "belum") {
      updateData.tanggal_selesai = null;
      if (clear_foto) {
        updateData.bukti_foto = null;
      }
    }

    await tagihan.update(updateData);

    res.status(200).json({ message: "Status berhasil diperbarui", data: tagihan });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Gagal memperbarui status", error: error.message });
  }
};

const updateFoto = async (req, res) => {
  try {
    const tagihan = await Tagihan.findOne({
      where: { tagihan_id: req.params.id, user_id: req.user.user_id || req.user.id },
    });

    if (!tagihan) {
      return res.status(404).json({ message: "Tagihan tidak ditemukan" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file yang diupload" });
    }

    const buktiFotoPath = "uploads/" + req.file.filename;

    await tagihan.update({
      bukti_foto: buktiFotoPath,
    });

    res.status(200).json({ message: "Foto berhasil diperbarui", data: tagihan });
  } catch (error) {
    console.error("Error updating foto:", error);
    res.status(500).json({ message: "Gagal memperbarui foto", error: error.message });
  }
};

module.exports = {
  getAllTagihan,
  getTagihanById,
  createTagihan,
  updateTagihan,
  deleteTagihan,
  tandaiLunas,
  updateStatus,
  updateFoto,
};
