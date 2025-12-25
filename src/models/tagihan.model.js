const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Tagihan = sequelize.define("tagihan", {
  tagihan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  jatuh_tempo: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  reminder_days: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },

  repeat_type: {
    type: DataTypes.STRING,
    defaultValue: "Sekali saja",
  },

  status: {
    type: DataTypes.ENUM("belum", "lunas"),
    defaultValue: "belum",
  },

  bukti_foto: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  tanggal_selesai: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "tagihan",
  timestamps: true,
});

module.exports = Tagihan;
