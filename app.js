const express = require("express");
const path = require("path");
const sequelize = require("./sequelize");
const { Setor, Maquina, Categoria, Problema } = require("./models");
const body = require("body-parser");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "static")));
app.use(body.urlencoded({ extended: true }));
app.use(body.json());

app.get("/tables", async (req, res) => {
  const [results] = await sequelize.query(
    "SELECT name FROM sqlite_master WHERE type='table'"
  );
  res.json(results);
});

app.get("/api/manual_maqs", async (req, res) => {
  try {
    const manualMaqs = await Setor.findAll({
      include: [
        {
          model: Maquina,
          include: [
            {
              model: Categoria,
              include: [Problema],
            },
          ],
        },
      ],
    });

    res.json(manualMaqs);
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    res.status(500).send("Erro ao buscar dados!");
  }
});

app.get("/manualmaquinas", async (req, res) => {
  res.render("manual_maqs");
});

app.get("/cadastro-maquinas", (req, res) => {
  res.render("cadastro_maquinas");
});

app.post("/enviar-cadastro", (req, res) => {
  const newManual = req.body;

  const cadastroMaq = async () => {
    try {
      await sequelize.authenticate();
      console.log("Conexão com o Banco de Dados estabelecida com Sucesso!");

      const fidSetorId = async (nome) => {
        const setor = await Setor.findOne({ where: { nome } })
        return setor ? setor.id : null;
      }

      for (setorNome in newManual) {
        const setorId = await fidSetorId(setorNome)
        console.log(setorId)

        const maquinas = newManual[setorNome]
        for (maquinaNome in maquinas) {
          const maquina = await Maquina.create({
            nome: maquinaNome,
            setorId: setorId
          })

          const categorias = maquinas[maquinaNome]
          for (const categoriaNome in categorias) {
            const categoria = await Categoria.create({
              nome: categoriaNome,
              maquinaId: maquina.id
            })

            const problemas = categorias[categoriaNome]
            for (const problemaNome of problemas) {
              await Problema.create({
                descricao: problemaNome,
                categoriaId: categoria.id
              })
            }
          }
        }
      }

      console.log("Dados adicionados com sucesso!")
    } catch (error) {
      console.error("Erro ao cadastrar os dados:", error);
    }
  };
  cadastroMaq()

  res.json(newManual);
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000.");
});
