const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Item = sequelize.define("items", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: DataTypes.STRING,
  checked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Item;