const sequelize = require("../sequelize");
const Setor = require("./Setor");
const Maquina = require("./Maquina");
const Categoria = require("./Categoria");
const Problema = require("./Problema");

// Relacionamentos
Setor.hasMany(Maquina, { foreignKey: "setorId" });
Maquina.belongsTo(Setor, { foreignKey: "setorId" });

Maquina.hasMany(Categoria, { foreignKey: "maquinaId" });
Categoria.belongsTo(Maquina, { foreignKey: "maquinaId" });

Categoria.hasMany(Problema, { foreignKey: "categoriaId" });
Problema.belongsTo(Categoria, { foreignKey: "categoriaId" });

module.exports = {
  sequelize,
  Setor,
  Maquina,
  Categoria,
  Problema,
};
