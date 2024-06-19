const express = require("express");
const path = require("path");
const sequelize = require("./sequelize");
const { Setor, Maquina, Categoria, Problema } = require("./models");
const body = require("body-parser")

const app = express();

app.use(express.static(path.join(__dirname, "static")));

app.get("/tables", async (req, res) => {
  const [results] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table'")
  res.json(results)
})

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
  
})

app.get("/login", (req, res) => {
  res.render("login");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000.");
});
