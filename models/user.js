const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const User = sequelize.define("User", {
  nome: {
    type: DataTypes.STRING,
    allownull: false,
    unique: true,
  },
});

module.exports = User;
