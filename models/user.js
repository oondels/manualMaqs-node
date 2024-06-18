const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const User = sequelize.define("User", {
  user: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  }
});

module.exports = User;
