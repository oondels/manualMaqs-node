document.addEventListener("DOMContentLoaded", () => {
  async function manualMaqs() {
    // Botões para selecionar se deseja ver defeitos Mecânicos ou Operacionais
    const buttonSelecaoDefeito = document.querySelectorAll(".selecao-defeito");

    try {
      const response = await fetch("/api/manual_maqs"); // Endpoint para obter os dados
      const manualMaqs = await response.json(); // Convertendo a resposta para JSON

      // Criando Lista Suspensa de Setores
      const selecaoSetor = document.getElementById("opcoes-setores");
      manualMaqs.forEach((setor) => {
        const opcaoSetor = document.createElement("option");
        opcaoSetor.value = setor.nome;
        opcaoSetor.text = setor.nome;
        selecaoSetor.appendChild(opcaoSetor);
      });

      // Inicializando Select2 após adicionar opções
      $("#opcoes-setores").select2({
        placeholder: "Pesquisar setor",
        allowClear: true,
      });

      $("#opcoes-maquinas").select2({
        placeholder: "Pesquisar Máquina",
        allowClear: true,
        language: {
          noResults: function () {
            return "Selecione um Setor primeiro!";
          },
        },
      });

      // Função para atualizar a lista de máquinas com base no setor selecionado
      function updateMaquinas() {
        const setorSelecionado =
          document.getElementById("opcoes-setores").value;
        const selecaoMaquina = document.getElementById("opcoes-maquinas");
        selecaoMaquina.innerHTML = '<option value=""></option>'; // Limpar opções anteriores e adicionar uma opção vazia

        manualMaqs.forEach((setor) => {
          if (setor.nome === setorSelecionado) {
            setor.Maquinas.forEach((maquina) => {
              const opcaoMaquina = document.createElement("option");
              opcaoMaquina.value = maquina.nome;
              opcaoMaquina.text = maquina.nome;
              selecaoMaquina.appendChild(opcaoMaquina);
            });
          }
        });

        // Re-inicializando Select2 após atualizar opções
        $("#opcoes-maquinas").select2({
          placeholder: "Pesquisar Máquina",
          allowClear: true,
        });
      }

      // Função para atualizar a exibição dos dados
      function updateDisplay() {
        const setorSelecionado = $("#opcoes-setores").val();
        const maquinaSelecionada = $("#opcoes-maquinas").val();
        const resultadosContainer = document.querySelector(".results");
        resultadosContainer.innerHTML = ""; // Limpar resultados anteriores

        if (manualMaqs && manualMaqs.length > 0) {
          manualMaqs.forEach((setor) => {
            // Filtrar setores pelo setor selecionado
            if (setorSelecionado && setor.nome !== setorSelecionado) {
              return;
            }

            const setorElement = document.createElement("div");
            setorElement.classList.add("setores-list");
            setorElement.innerHTML = `<h1>${setor.nome}</h1>`;

            if (setor.Maquinas && setor.Maquinas.length > 0) {
              setor.Maquinas.forEach((maquina) => {
                // Filtrar máquinas pela máquina selecionada
                if (maquinaSelecionada && maquina.nome !== maquinaSelecionada) {
                  return;
                }

                const maquinaElement = document.createElement("div");
                maquinaElement.classList.add("maquinas-list");

                maquinaElement.innerHTML = `<h3 class="toggle-button">${maquina.nome}</h3>`;

                const categoriasElement = document.createElement("div");
                categoriasElement.classList.add("categorias-list");
                categoriasElement.classList.add("hidden");
                if (maquina.Categoria && maquina.Categoria.length > 0) {
                  maquina.Categoria.forEach((categoria) => {
                    const categoriaElement = document.createElement("div");
                    categoriaElement.classList.add("categoria");
                    categoriaElement.innerHTML = `<h5 class="toggle-button">${categoria.nome}</h5>`;

                    if (categoria.Problemas && categoria.Problemas.length > 0) {
                      const problemasList = document.createElement("ul");
                      problemasList.classList.add("hidden");
                      problemasList.classList.add("problemas-list");

                      categoria.Problemas.forEach((problema) => {
                        const conteinerProblema = document.createElement("div");
                        conteinerProblema.classList.add("container-problema");
                        const problemaElement = document.createElement("li");
                        problemaElement.classList.add("problema-item");

                        // Separando a lista de Operacional e Mecânico
                        buttonSelecaoDefeito.forEach((button) => {
                          button.addEventListener("click", (event) => {
                            event.target.classList.toggle("active");

                            conteinerProblema.remove();
                            if (
                              problema.descricao.includes(event.target.value)
                            ) {
                              problemaElement.textContent = problema.descricao;
                              conteinerProblema.appendChild(problemaElement);
                              problemasList.appendChild(conteinerProblema);
                            }
                          });
                        });

                        problemaElement.textContent = problema.descricao;
                        conteinerProblema.appendChild(problemaElement);
                        problemasList.appendChild(conteinerProblema);
                      });

                      // Mudar cor do botão dew seleção de Op.l Mec. ao ser clicado
                      buttonSelecaoDefeito.forEach((button) => {
                        button.addEventListener("click", (event) => {
                          event.target.classList.toggle("ativado");

                          const nextSibling = event.target.nextElementSibling;
                          const previousSibling =
                            event.target.previousElementSibling;

                          // Se o próximo irmão existe e tem a classe "ativado", removê-la
                          if (
                            nextSibling &&
                            nextSibling.classList.contains("ativado")
                          ) {
                            nextSibling.classList.remove("ativado");
                          }

                          // Se o irmão anterior existe e tem a classe "ativado", removê-la
                          if (
                            previousSibling &&
                            previousSibling.classList.contains("ativado")
                          ) {
                            previousSibling.classList.remove("ativado");
                          }
                        });
                      });

                      categoriaElement.appendChild(problemasList);
                    } else {
                      const noProblemas = document.createElement("p");
                      noProblemas.textContent =
                        "Sem problemas cadastrados no sistema";
                      categoriaElement.appendChild(noProblemas);
                    }
                    categoriasElement.appendChild(categoriaElement);
                    maquinaElement.appendChild(categoriasElement);
                  });
                } else {
                  const noCategorias = document.createElement("p");
                  noCategorias.textContent =
                    "Sem categorias cadastradas no sistema";
                  maquinaElement.appendChild(noCategorias);
                }

                setorElement.appendChild(maquinaElement);
              });
            } else {
              const noMaquinas = document.createElement("p");
              noMaquinas.textContent = "Sem máquinas cadastradas no sistema";
              setorElement.appendChild(noMaquinas);
            }

            resultadosContainer.appendChild(setorElement);
          });
        } else {
          const noSetores = document.createElement("p");
          noSetores.textContent = "Sem setores cadastrados no sistema";
          resultadosContainer.appendChild(noSetores);
        }
        toggleButtons();

        // Adicionar icone na lista de soluções
        const iconProblema = () => {
          const defeitos = document.querySelectorAll(".problema-item");

          defeitos.forEach((defeito) => {
            const contentItem = defeito.innerText;
            defeito.classList.add("textGuide");
            if (contentItem.includes("Mecânico")) {
              const icon = document.createElement("img");
              const messageGuide = document.createElement("div");
              messageGuide.innerHTML = "Mecânico";
              messageGuide.classList.add("tooltip");
              icon.src = "/img/mecanico-icon.png";
              defeito.appendChild(icon);
              defeito.appendChild(messageGuide);
            } else if (contentItem.includes("Operacional")) {
              const icon = document.createElement("img");
              const messageGuide = document.createElement("div");
              messageGuide.innerHTML = "Operacional";
              messageGuide.classList.add("tooltip");
              icon.src = "/img/operador-icon.png";
              defeito.appendChild(icon);
              defeito.appendChild(messageGuide);
            }
          });
        };
        iconProblema();
      }

      function toggleButtons() {
        const toggleButtons = document.querySelectorAll(".toggle-button");

        toggleButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const content = this.nextElementSibling;

            if (content.classList.contains("hidden")) {
              content.classList.remove("hidden");
              content.style.display = "block";

              // Forçar reflow para garantir que a transição seja aplicada
              void content.offsetWidth;
              content.classList.add("show");
              button.classList.add("active");
            } else {
              button.classList.remove("active");
              content.classList.remove("show");
              content.classList.add("hidden");
              // Atraso para garantir que a transição ocorra antes de ocultar
              setTimeout(() => {
                content.style.display = "none";
              }, 500); // Deve ser o mesmo valor da transição (0.5s)
            }
          });
        });
      }

      // Adicionar o evento onchange às listas suspensas
      $("#opcoes-setores").on("change", () => {
        updateMaquinas();
        updateDisplay();
      });

      $("#opcoes-maquinas").on("change", updateDisplay);

      updateDisplay();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  manualMaqs();
});
