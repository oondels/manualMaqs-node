const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const User = sequelize.define("Users", {
  user: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = User;
