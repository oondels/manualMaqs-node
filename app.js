const express = require("express");
const path = require("path");
const sequelize = require("./sequelize");
const { Setor, Maquina, Categoria, Problema } = require("./models");

const app = express();

app.get("/manualmaquinas", async (req, res) => {
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

    res.render("manual_maqs", { manualMaqs });
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    res.status(500).send("Erro ao buscar dados!");
  }
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000.");
});
