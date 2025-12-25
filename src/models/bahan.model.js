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
            key: "id",
        },
        onDelete: "CASCADE",
    },
    nama_bahan:{
        type:DataTypes.STRING(255),
        allowNull:false,
    },
     jumlah:{
        type:DataTypes.INTEGER(50),
        allowNull:false,
    },
    satuan: {
    type: DataTypes.STRING(50),
    allowNull: false,
    },
    },{
    tableName: "bahan",
    timestamps: false,
});

Resep.hasMany(Bahan, { foreignKey: "resep_id", onDelete: "CASCADE" });
Bahan.belongsTo(Resep, { foreignKey: "resep_id" });

module.exports = Bahan;