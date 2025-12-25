
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Pengguna = sequelize.define("Pengguna", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  foto_profil: { 
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "pengguna", 
  timestamps: false,
});

module.exports = Pengguna;
