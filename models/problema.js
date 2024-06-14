const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Problema = sequelize.define("Problema", {
  descricao: {
    type: DataTypes.STRING,
    allownul: false,
  },
});

module.exports = Problema;
