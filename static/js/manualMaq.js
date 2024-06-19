document.addEventListener("DOMContentLoaded", (event) => {
  let contadorDefeitos = 0;

  function adicionarDefeito() {
    contadorDefeitos++;

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

    const solucoesInput = document.createElement("input");
    solucoesInput.type = "text";
    solucoesInput.name = `solucoesNome-${contadorDefeitos}`;
    solucoesInput.placeholder = "Soluções";
    defeitoContainer.appendChild(solucoesInput);

    const defeitosList = document.getElementById("defeitosList");
    defeitosList.appendChild(defeitoContainer);
  }

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

      if (!manualMaq[setor][maquina]["Defeitos"]) {
        manualMaq[setor][maquina]["Defeitos"] = [];
      }

      for (let i = 0; i <= contadorDefeitos; i++) {
        if (i != 0) {
          const defeitoNome = formData.get(`defeitoNome-${i}`);
          const solucoesNome = formData.get(`solucoesNome-${i}`);
          manualMaq[setor][maquina]["Defeitos"].push({
            [defeitoNome]: solucoesNome,
          });
        }
      }

      manualMaq[setor][maquina]["Items a Verificar"] = checklist;

      console.log(manualMaq);
    });

  window.adicionarDefeito = adicionarDefeito;
});
