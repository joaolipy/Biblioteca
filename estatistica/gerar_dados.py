"""
Gera um conjunto de dados SIMULADO de empréstimos da biblioteca.
Serve para desenvolver a análise descritiva enquanto a API ainda não tem
dados reais. Na Sprint 2, troque o CSV por uma exportação da API/banco
mantendo as mesmas colunas.
"""
import numpy as np
import pandas as pd

rng = np.random.default_rng(42)
N = 600

generos = ["Romance", "Fantasia", "Técnico", "Infantil", "Biografia", "Ficção Científica", "Didático"]
pesos_genero = [0.22, 0.17, 0.14, 0.13, 0.08, 0.10, 0.16]

# Sazonalidade: mais empréstimos no início do ano letivo (fev/mar) e em ago/set
mes_peso = np.array([0.6, 1.5, 1.4, 1.0, 1.0, 0.7, 0.6, 1.3, 1.3, 1.0, 0.9, 0.5])
meses = pd.period_range("2025-01", "2026-09", freq="M")
w = np.array([mes_peso[p.month - 1] for p in meses], dtype=float)
w /= w.sum()
mes_escolhido = rng.choice(len(meses), size=N, p=w)
dias_no_mes = np.array([meses[i].days_in_month for i in mes_escolhido])
dia = (rng.integers(0, 28, size=N) % dias_no_mes)
data_emprestimo = pd.to_datetime([f"{meses[i].year}-{meses[i].month:02d}-01" for i in mes_escolhido]) + pd.to_timedelta(dia, unit="D")

tipo = rng.choice(["Livro", "Revista"], size=N, p=[0.82, 0.18])
prazo = np.where(tipo == "Livro", 14, 7)
genero = rng.choice(generos, size=N, p=pesos_genero)

# Livros maiores demoram mais para serem lidos
paginas = np.where(
    tipo == "Livro",
    np.clip(rng.normal(280, 110, N), 60, 800),
    np.clip(rng.normal(70, 20, N), 30, 140),
).round().astype(int)

base = np.where(tipo == "Livro", 6 + paginas / 45, 3 + paginas / 40)
dias_emprestimo = np.clip(rng.normal(base, 3.2), 1, None).round().astype(int)
dias_atraso = np.clip(dias_emprestimo - prazo, 0, None)
multa_dia = np.where(tipo == "Livro", 1.5, 0.75)

df = pd.DataFrame({
    "id_emprestimo": np.arange(1, N + 1),
    "id_leitor": rng.integers(1, 121, size=N),
    "tipo": tipo,
    "genero": genero,
    "paginas": paginas,
    "data_emprestimo": data_emprestimo,
    "prazo_dias": prazo,
    "dias_emprestimo": dias_emprestimo,
    "dias_atraso": dias_atraso,
    "multa": (dias_atraso * multa_dia).round(2),
}).sort_values("data_emprestimo").reset_index(drop=True)
df["id_emprestimo"] = np.arange(1, N + 1)

df.to_csv("emprestimos.csv", index=False)
print(f"emprestimos.csv gerado com {len(df)} linhas")
