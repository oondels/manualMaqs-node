document.addEventListener("DOMContentLoaded", (event) => {
  let contadorDefeitos = 0;

  function adicionarDefeito() {
    contadorDefeitos++;

    // Configuração da adição de novos forumlários ao clique do usuário

    const defeitoContainer = document.createElement("div");
    defeitoContainer.className = "defeito-container";
    defeitoContainer.id = `defeito-${contadorDefeitos}`;

    const defeitoLabel = document.createElement("label");
    defeitoLabel.textContent = `Defeito ${contadorDefeitos}:`;
    defeitoContainer.appendChild(defeitoLabel);

    const defeitoInput = document.createElement("input");
    defeitoInput.type = "text";
    defeitoInput.name = `defeitoNome-${contadorDefeitos}`;
    defeitoInput.placeholder = "Nome do Defeito";
    defeitoContainer.appendChild(defeitoInput);

    const solucoesLabel = document.createElement("label");
    solucoesLabel.textContent = `Soluções para Defeito ${contadorDefeitos}:`;
    defeitoContainer.appendChild(solucoesLabel);

    const solucoesArea = document.createElement("div");
    solucoesArea.classList.add("textGuide");
    const messageGuide = document.createElement("div");
    messageGuide.innerHTML = "Insira os itens separados por vírgula.";
    messageGuide.classList.add("tooltip");
    const solucoesInput = document.createElement("textarea");
    solucoesArea.appendChild(solucoesInput);
    solucoesArea.appendChild(messageGuide);

    solucoesInput.name = `solucoesNome-${contadorDefeitos}`;
    solucoesInput.placeholder = "Soluções";
    defeitoContainer.appendChild(solucoesArea);

    const defeitosList = document.getElementById("defeitosList");
    defeitosList.appendChild(defeitoContainer);
  }

  // Coleta de dados do formulário ao enviar
  document
    .getElementById("defeitosForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(event.target);

      let setor = formData.get("setor");
      let maquina = formData.get("maquina");

      const checklist = formData.get("checklist");

      let manualMaq = {};

      if (!manualMaq[setor]) {
        manualMaq[setor] = {};
      }

      if (!manualMaq[setor][maquina]) {
        manualMaq[setor][maquina] = {};
      }

      // Criando Objeto para enviar para o backEnd
      for (let i = 0; i <= contadorDefeitos; i++) {
        if (i != 0) {
          const defeitoNome = formData.get(`defeitoNome-${i}`);
          const solucoesNome = formData.get(`solucoesNome-${i}`);
          manualMaq[setor][maquina][defeitoNome] = solucoesNome.split(",");
        }
      }
      manualMaq[setor][maquina]["Items a Verificar"] = checklist.split(",");

      // Envio de dados
      fetch("/enviar-cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(manualMaq),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          alert("Formulário enviado com sucesso!");

          // window.location.href = "/rota..."
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });

  window.adicionarDefeito = adicionarDefeito;
  adicionarDefeito();
});
