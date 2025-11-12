const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Resep = require('./resep.model');

const Bahan = sequelize.define("Bahan", {
    bahan_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    },
    resep_id:{
        type: DataTypes.INTEGER,
        references:{
            model: Resep,
            key: "resep_id",
        },
        onDelete: "CASCADE",
    },
    nama_bahan:{
        type:DataTypes.STRING(255),
        allowNull:false,
    },
    },{
    tableName: "bahan_resep",
    timestamps: false,
});

Resep.hasMany(Bahan, { foreignKey: "resep_id", onDelete: "CASCADE" });
Bahan.belongsTo(Resep, { foreignKey: "resep_id" });

module.exports = Bahan;