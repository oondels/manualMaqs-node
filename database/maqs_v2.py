import pandas as pd
import json

# Lendo o arquivo de texto com máquinas, defeitos e soluções
with open('maqs.txt', encoding='utf-8') as manual:
    manual_tpm = manual.read()

# Lendo o arquivo CSV com a relação de máquinas e setores
db = pd.read_csv("./maquinas_setor/maquinas.csv", encoding="utf-8", delimiter=",")

# Estrutura para armazenar as informações organizadas por setor
maqs_problem_solution = {
    "Montagem": {},
    "Apoio": {},
    "Costura": {},
    "Serigrafia": {},
    "Pré Solado": {},
    "Corte Automático": {},
    "Lavagem": {},
    "Dublagem": {},
    "Bordado": {}
}

# Função para separar defeitos e itens a verificar
def solucao_defeito(setor, list_maquina):
    count = 0
    for item in list_maquina:
        try:
            maqs_problem_solution[setor][list_maquina[0]][list_maquina[1]] = list_maquina[2:]
            if 'Itens a Verificar' in item:
                maqs_problem_solution[setor][list_maquina[0]][list_maquina[count]] = list_maquina[count+1:]
        except:
            pass

# Separando as máquinas por setor
for list_maquina in [list.split('\n') for list in manual_tpm.split('\n\n') if list]:
    setores_maq = db[db['Máquina'] == list_maquina[0]]["Setor"].values
    
    if setores_maq.size > 0:
        if len(setores_maq) > 0:
            setores = setores_maq[0].split('/')
            for setor in setores:
                setor = setor.strip()
                if setor in maqs_problem_solution:
                    if list_maquina[0] not in maqs_problem_solution[setor]:
                        maqs_problem_solution[setor][list_maquina[0]] = {}
                    solucao_defeito(setor, list_maquina)
    else:
        print(f"Setor nao encontrado na maquina: {list_maquina[0]}")
    

# Convertendo para formato JSON
json_file = json.dumps(maqs_problem_solution, ensure_ascii=False, indent=4)
with open("manual_maqs_noSQL.json", "w", encoding="utf-8") as manual_noSQL:
    manual_noSQL.write(json_file)

print("Processamento concluído e arquivo JSON gerado.")