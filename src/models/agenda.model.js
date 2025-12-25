const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");

const Agenda = sequelize.define("Agenda", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "user_id",
        },
    },
    judul: { type: DataTypes.STRING, allowNull: false },
    kategori: { type: DataTypes.STRING, allowNull: false },
    deskripsi: { type: DataTypes.TEXT },
    date: { type: DataTypes.DATEONLY, allowNull: false }, 
    time: { type: DataTypes.TIME, allowNull: false },     
    location: { type: DataTypes.STRING },
    reminder: { type: DataTypes.STRING },
    isCompleted: { type: DataTypes.BOOLEAN, defaultValue: 0 },
}, {
    tableName: "agendas",
    timestamps: true, 
});

User.hasMany(Agenda, { foreignKey: "user_id" });
Agenda.belongsTo(User, { foreignKey: "user_id" });

module.exports = Agenda;
