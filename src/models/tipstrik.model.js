const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const TipsTrik = sequelize.define ("TipsTrik",{
    tips_id :{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    },

    title :{
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    source :{
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    image_url :{
        type:DataTypes.STRING(50),
        allowNull:false,
    },
    link_url:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    tanggal_update: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
     },

},{
    tableName: "tips_trik",
    timestamps: false,
  });      
  

module.exports = TipsTrik;