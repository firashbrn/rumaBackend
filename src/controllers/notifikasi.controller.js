const Notifikasi = require("../models/notifikasi.model");
const Agenda = require("../models/agenda.model");

exports.getNotifikasiList = async (req, res) => {
    try {
        const notifikasi = await Notifikasi.findAll({
            where: { user_id: req.user.user_id || req.user.id },
            include: [{
                model: Agenda,
                required: false, 
                attributes: ['kategori', 'judul', 'deskripsi', 'location', 'date', 'time', 'reminder']
            }],
            order: [['timestamp', 'DESC']]
        });
        res.status(200).json(notifikasi);
    } catch (error) {
        console.error("Error fetching notifikasi:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.createNotifikasi = async (req, res) => {
    try {
        

        
        const { id, referenceId, referenceType, jenisNotifikasi, ...otherData } = req.body;

        
        let agendaId = null;
        if (referenceType === 'agenda' || jenisNotifikasi === 'pengingat_agenda') {
            agendaId = referenceId;
        }

        const newNotifikasi = await Notifikasi.create({
            ...otherData,
            user_id: req.user.user_id || req.user.id,
            jenisNotifikasi: jenisNotifikasi,
            reference_id: referenceId, 
            reference_type: referenceType,
            agendaId: agendaId, 
            timestamp: req.body.timestamp || Date.now()
        });

        res.status(201).json({ message: "Notifikasi synced", newNotifikasi });
    } catch (error) {
        console.error("❌ Error creating notifikasi:", error);
        res.status(500).json({ message: "Gagal menyimpan notifikasi", error });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notifikasi = await Notifikasi.findOne({
            where: {
                id: req.params.id, 
                user_id: req.user.user_id || req.user.id
            },
        });

        if (!notifikasi) {
            return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
        }

        await notifikasi.update({ isRead: true });
        res.status(200).json({ message: "Notifikasi marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Gagal update status", error });
    }
};

module.exports = {
    getNotifikasiList: exports.getNotifikasiList,
    createNotifikasi: exports.createNotifikasi,
    markAsRead: exports.markAsRead
};
