const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Setor = sequelize.define("Setor", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Setor;
