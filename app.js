const express = require("express");
const path = require("path");
const sequelize = require("./sequelize");
const { Setor, Maquina, Categoria, Problema } = require("./models");
const User = require("./models/user");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authLogin = require("./auth/authLogin");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com Banco de dados estabelecida com sucesso!");

    app.listen(3000, () => {
      console.log("Servidor rodando na porta 3000.");
    });
  })
  .catch((erro) => {
    console.error(
      "Não foi possivel estabelecer conexão com banco de dados:",
      erro
    );
  });

app.get("/tables", authLogin, async (req, res) => {
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

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register-user", async (req, res) => {
  const { userInput, senhaInput } = req.body;
  const senhaEncoded = await bcrypt.hash(senhaInput, 10);

  try {
    await User.create({
      user: userInput,
      senha: senhaEncoded,
    });
    res.status(201).redirect("/login");
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
  }
});

app.get("/login", authLogin, (req, res) => {
  if (req.userId) {
    return res.json({ error: "voce ja esta logado" });
  }
  res.render("login");
});

app.post("/login-token", async (req, res) => {
  try {
    const { userInput, senhaInput } = req.body;

    const user = await User.findOne({ where: { user: userInput } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }

    const testPassword = await bcrypt.compare(senhaInput, user.senha);
    if (!testPassword) {
      return res.status(401).json({ error: "Senha Incorreta!" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        admin: user.admin,
      },
      "senhaDass",
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, { httpOnly: true });
    res.redirect(`/manualmaquinas`);
  } catch (error) {
    console.error("Erro ao buscar Usuário:", error);
  }
});

app.get("/manualmaquinas", authLogin, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findByPk(userId);
    res.render("manual_maqs", { user });
  } catch (error) {
    res.json({ error: "Erro ao buscar usuário" });
  }
});

app.get("/cadastro-maquinas", authLogin, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findByPk(userId);

    if (user.admin) {
      return res.render("cadastro_maquinas");
    }
    return res.json({ error: "Você não tem acesso a essa página" });
  } catch (error) {
    res.json({ error: "Erro ao buscar usuário" });
  }
});

app.post("/enviar-cadastro", (req, res) => {
  const newManual = req.body;

  const cadastroMaq = async () => {
    try {
      // Pegar id do setor selecionado
      const fidSetorId = async (nome) => {
        const setor = await Setor.findOne({ where: { nome } });
        return setor ? setor.id : null;
      };

      for (setorNome in newManual) {
        const setorId = await fidSetorId(setorNome);

        const maquinas = newManual[setorNome];
        for (maquinaNome in maquinas) {
          const maquina = await Maquina.create({
            nome: maquinaNome,
            setorId: setorId,
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

      console.log("Dados adicionados com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar os dados:", error);
    }
  };

  cadastroMaq();

  res.json(newManual);
});
