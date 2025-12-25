const Agenda = require("../models/agenda.model");
const Notifikasi = require("../models/notifikasi.model");
const { Op } = require("sequelize");

function formatDateForResponse(date) {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`; 
}

exports.createAgenda = async (req, res) => {
    try {
        const { kategori, judul, deskripsi, date, time, location, reminder } = req.body;

        if (!kategori || !judul || !date || !time) {
            return res.status(400).json({ message: "Lengkapi data wajib (judul, kategori, tanggal, waktu)" });
        }

        const newAgenda = await Agenda.create({
            user_id: req.user.user_id || req.user.id,
            kategori, judul, deskripsi, date, time, location, reminder
        });

        if (reminder) {
            await Notifikasi.create({
                pesan: `Pengingat Agenda: ${judul}`,
                reference_id: newAgenda.id,
                reference_type: 'agenda',
                user_id: req.user.user_id || req.user.id,
                jenis_notifikasi: 'pengingat_agenda'
            });
        }

        res.status(201).json({
            message: "Agenda berhasil ditambahkan",
            data: {
                ...newAgenda.toJSON(),
                date: formatDateForResponse(newAgenda.date)
            }
        });
    } catch (error) {
        console.error("Error creating agenda:", error);
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

exports.getAllAgendas = async (req, res) => {
    try {
        const { search, kategori, date } = req.query;
        let condition = { user_id: req.user.user_id || req.user.id };

        if (search) condition.judul = { [Op.like]: `%${search}%` };
        if (kategori) condition.kategori = kategori;
        if (date) condition.date = date;

        const agendas = await Agenda.findAll({ where: condition, order: [['date', 'ASC'], ['time', 'ASC']] });

        const formattedAgendas = agendas.map(agenda => ({
            ...agenda.toJSON(),
            date: formatDateForResponse(agenda.date)
        }));

        res.status(200).json({ message: "Success", data: formattedAgendas });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAgendaDetail = async (req, res) => {
    try {
        const agenda = await Agenda.findOne({
            where: { id: req.params.id, user_id: req.user.user_id || req.user.id }
        });

        if (!agenda) return res.status(404).json({ message: "Agenda tidak ditemukan" });

        res.status(200).json({
            ...agenda.toJSON(),
            date: formatDateForResponse(agenda.date)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAgenda = async (req, res) => {
    try {
        const { id } = req.params;
        const { kategori, judul, deskripsi, date, time, location, reminder, isCompleted } = req.body;

        const agenda = await Agenda.findOne({
            where: { id: id, user_id: req.user.user_id || req.user.id }
        });

        if (!agenda) return res.status(404).json({ message: "Agenda tidak ditemukan" });

        await agenda.update({ kategori, judul, deskripsi, date, time, location, reminder, isCompleted });

        res.status(200).json({
            message: "Agenda berhasil terupdate",
            data: {
                ...agenda.toJSON(),
                date: formatDateForResponse(agenda.date)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAgenda = async (req, res) => {
    try {
        const deleted = await Agenda.destroy({
            where: {
                id: req.params.id,
                user_id: req.user.user_id || req.user.id
            }
        });

        if (deleted === 0) {
            return res.status(404).json({
                message: "Gagal hapus: Agenda tidak ditemukan"
            });
        }

        res.status(200).json({ message: "Agenda berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
