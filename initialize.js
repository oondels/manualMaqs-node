const { sequelize, User } = require("./models");

async function initializeDB() {
  try {
    // Inicio da conexão
    await sequelize.authenticate();
    console.log("Conexão com Banco Estabelecida.");

    // Sincronizar o esquema (criar tabelas no banco de dados)
    await sequelize.sync({ force: true });
    console.log("Esquema sincronizado");
  } catch (error) {
    console.error("Erro ao sincronizar com o banco de dados:", error);
  }
}

initializeDB();
