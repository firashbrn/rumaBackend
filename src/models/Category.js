const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define("categories", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  shopping_list_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: DataTypes.STRING
});

module.exports = Category;