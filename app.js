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

      const setor = await Setor.create({
        nome: setorNome,
      });

      const maquina = await Maquina.create({
        nome: maquinaNome,
        setorId: setor.id,
      });

      for (const categoriaNome in defeitosNome) {
        const categoria = await Categoria.create({
          nome: categoriaNome,
          maquinaId: maquina.id,
        });
        for (const solucaoNome in solucoesNome) {
          await Problema.create({
            descricao: solucaoNome,
            categoriaId: categoria.id,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao cadastrar os dados:", error);
    }
  };

  res.json(newManual);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000.");
});
