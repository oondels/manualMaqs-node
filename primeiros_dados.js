const { sequelize, Setor, Maquina, Categoria, Problema } = require("./models");
const manual_maquinas = require("./database/manual_maqs_noSQL.json");

async function maquinasDB() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com banco de dados estabelecida");

    for (const setorNome in manual_maquinas) {
      const setor = await Setor.create({ nome: setorNome });

      const maquinas = manual_maquinas[setorNome];
      for (const maquinaNome in maquinas) {
        const maquina = await Maquina.create({
          nome: maquinaNome,
          setorId: setor.id,
        });

        const categorias = maquinas[maquinaNome];
        for (const categoriaNome in categorias) {
          const categoria = await Categoria.create({
            nome: categoriaNome,
            maquinaId: maquina.id,
          });

          const problemas = categorias[categoriaNome];
          for (const problemaNome of problemas) {
            await Problema.create({
              descricao: problemaNome,
              categoriaId: categoria.id,
            });
          }
        }
      }
    }

    console.log("Dados adicionados com Sucesso!");
  } catch (error) {
    console.log("Erro ao adicionar as informações no banco de dados:", error);
  }
}

maquinasDB();
