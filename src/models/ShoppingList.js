const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ShoppingList = sequelize.define("shopping_lists", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shopping_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
});

module.exports = ShoppingList;