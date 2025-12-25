const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Resep = require('./resep.model');

const Langkah = sequelize.define("Langkah", {
    id: {
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
    urutan:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    deskripsi:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
     foto_langkah:{
        type:DataTypes.STRING(255),
        allowNull:true,
    },
    },{
    tableName: "langkah",
    timestamps: false,
});

Resep.hasMany(Langkah, { foreignKey: "resep_id", onDelete: "CASCADE" });
Langkah.belongsTo(Resep, { foreignKey: "resep_id" });

module.exports = Langkah;