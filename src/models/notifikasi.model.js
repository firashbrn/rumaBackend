const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Agenda = require("./agenda.model");

const Notifikasi = sequelize.define("Notifikasi", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pesan: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false }, 
    kategori: { type: DataTypes.STRING, defaultValue: "semua" },

    
    agendaId: {
        type: DataTypes.INTEGER, 
        references: {
            model: Agenda,
            key: "id",
        },
        allowNull: true,
    },

    
    reference_id: { type: DataTypes.INTEGER, allowNull: true },
    reference_type: { type: DataTypes.STRING, allowNull: true },

    timestamp: { type: DataTypes.BIGINT, allowNull: false }, 
    jenisNotifikasi: { type: DataTypes.STRING, defaultValue: "pengingat_agenda" }, 

    
    

}, {
    tableName: "notifikasi",
    timestamps: true, 
});

Agenda.hasMany(Notifikasi, { foreignKey: "agendaId", onDelete: "CASCADE" });
Notifikasi.belongsTo(Agenda, { foreignKey: "agendaId" });

module.exports = Notifikasi;
