const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Maquina = sequelize.define("Maquina", {
  nome: {
    type: DataTypes.STRING,
    allownull: false,
    unique: true,
  },
});

module.exports = Maquina;
