const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Pengguna = require("./user.model");

const Resep = sequelize.define ("Resep",{
    id :{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    },
    user_id:{
        type: DataTypes.INTEGER,
      references: {
        model: Pengguna,
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    judul :{
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    foto :{
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    waktu_masak :{
        type:DataTypes.INTEGER(50),
        allowNull:true,
    },
    porsi:{
        type: DataTypes.INTEGER(50),
        allowNull: true,
    },
    is_favorit:{
        type: DataTypes.TINYINT,
        defaultValue : true,
    },
    createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    underscored: true,
     },
    updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    underscored: true,
     },

},{
    tableName: "resep",
    timestamps: false,
  });      
  
Pengguna.hasMany(Resep, { foreignKey: "user_id", onDelete: "CASCADE" });
Resep.belongsTo(Pengguna, { foreignKey: "user_id" });

module.exports = Resep;