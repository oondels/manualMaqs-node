const { Sequelize } = require("sequelize");

// Configuração conexão Banco de Dados
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database/database.sqlite",
});

module.exports = sequelize;
