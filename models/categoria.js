const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Categoria = sequelize.define("Categoria", {
  nome: {
    type: DataTypes.STRING,
    allownull: false,
  },
});

module.exports = Categoria;
