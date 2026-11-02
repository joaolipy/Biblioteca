# %% [markdown]
# # Análise Descritiva — Biblioteca (Sprint 1)
#
# **Persona / cliente:** a coordenadora de uma biblioteca comunitária, que precisa decidir
# o que comprar, quais prazos de empréstimo praticar e como reduzir atrasos.
#
# **Objetivos de negócio → perguntas**
# 1. Quais gêneros têm mais saída? (orientar compras) → *gráfico de barras*
# 2. Como a demanda e os atrasos variam ao longo do tempo? (planejar equipe/acervo) → *série temporal*
# 3. Quanto tempo os itens ficam emprestados e o prazo atual é adequado? → *histograma*
# 4. Livros maiores demoram mais para voltar? (calibrar prazo por tamanho) → *dispersão + regressão*
#
# > Os dados (`emprestimos.csv`) são **simulados** (`gerar_dados.py`). Na Sprint 2, substitua
# > por dados reais exportados da API mantendo as mesmas colunas.

# %%
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
from scipy import stats

os.makedirs("graficos", exist_ok=True)
plt.rcParams.update({"figure.figsize": (9, 5), "axes.spines.top": False, "axes.spines.right": False})

df = pd.read_csv("emprestimos.csv", parse_dates=["data_emprestimo"])
df["atrasou"] = df["dias_atraso"] > 0
df["mes"] = df["data_emprestimo"].dt.to_period("M")
df.head()

# %% [markdown]
# ## 1. Métricas de negócio (KPIs)

# %%
total = len(df)
taxa_atraso = df["atrasou"].mean() * 100
atrasados = df[df["atrasou"]]

kpis = {
    "Total de empréstimos": total,
    "Taxa de atraso (%)": round(taxa_atraso, 1),
    "Duração média do empréstimo (dias)": round(df["dias_emprestimo"].mean(), 1),
    "Duração mediana (dias)": df["dias_emprestimo"].median(),
    "Desvio padrão da duração (dias)": round(df["dias_emprestimo"].std(), 1),
    "Atraso médio entre os atrasados (dias)": round(atrasados["dias_atraso"].mean(), 1),
    "Multa total arrecadada (R$)": round(df["multa"].sum(), 2),
    "Multa média por atraso (R$)": round(atrasados["multa"].mean(), 2),
    "Leitores distintos": df["id_leitor"].nunique(),
}
pd.Series(kpis, name="valor").to_frame()

# %% [markdown]
# **Taxa de atraso por tipo de item** — compara Livro (prazo 14 dias) e Revista (prazo 7 dias).

# %%
por_tipo = df.groupby("tipo").agg(
    emprestimos=("id_emprestimo", "count"),
    taxa_atraso_pct=("atrasou", lambda s: round(s.mean() * 100, 1)),
    duracao_media=("dias_emprestimo", lambda s: round(s.mean(), 1)),
)
por_tipo

# %% [markdown]
# ## 2. Gêneros mais emprestados (barras)

# %%
ranking = df["genero"].value_counts().sort_values()
fig, ax = plt.subplots()
ax.barh(ranking.index, ranking.values, color="#3b6ea5")
for y, v in enumerate(ranking.values):
    ax.text(v + 2, y, str(v), va="center")
ax.set_title("Empréstimos por gênero")
ax.set_xlabel("Quantidade de empréstimos")
fig.tight_layout()
fig.savefig("graficos/01_generos_barras.png", dpi=150)
ranking.sort_values(ascending=False)

# %% [markdown]
# ## 3. Evolução mensal de empréstimos e da taxa de atraso (série temporal)

# %%
mensal = df.groupby("mes").agg(
    emprestimos=("id_emprestimo", "count"),
    taxa_atraso=("atrasou", "mean"),
)
mensal.index = mensal.index.to_timestamp()

fig, ax1 = plt.subplots()
ax1.plot(mensal.index, mensal["emprestimos"], marker="o", color="#3b6ea5", label="Empréstimos")
ax1.set_ylabel("Empréstimos no mês", color="#3b6ea5")
ax2 = ax1.twinx()
ax2.spines["right"].set_visible(True)
ax2.plot(mensal.index, mensal["taxa_atraso"] * 100, marker="s", linestyle="--", color="#c0562f", label="Taxa de atraso")
ax2.set_ylabel("Taxa de atraso (%)", color="#c0562f")
ax1.set_title("Empréstimos e taxa de atraso por mês")
fig.autofmt_xdate()
fig.tight_layout()
fig.savefig("graficos/02_serie_temporal.png", dpi=150)
mensal.round(2).tail(6)

# %% [markdown]
# ## 4. Distribuição da duração dos empréstimos (histograma)
# As linhas verticais mostram os prazos praticados: quem passa delas está em atraso.

# %%
fig, ax = plt.subplots()
ax.hist(df["dias_emprestimo"], bins=range(0, int(df["dias_emprestimo"].max()) + 2), color="#3b6ea5", edgecolor="white")
ax.axvline(df["dias_emprestimo"].mean(), color="black", linestyle="-", label=f"Média ({df['dias_emprestimo'].mean():.1f} d)")
ax.axvline(7, color="#c0562f", linestyle="--", label="Prazo revista (7 d)")
ax.axvline(14, color="#2f8f5b", linestyle="--", label="Prazo livro (14 d)")
ax.set_title("Duração dos empréstimos")
ax.set_xlabel("Dias emprestado")
ax.set_ylabel("Frequência")
ax.legend()
fig.tight_layout()
fig.savefig("graficos/03_histograma_duracao.png", dpi=150)
df["dias_emprestimo"].describe().round(2)

# %% [markdown]
# ## 5. Tamanho do livro × tempo de empréstimo (dispersão + regressão linear)

# %%
livros = df[df["tipo"] == "Livro"]
reg = stats.linregress(livros["paginas"], livros["dias_emprestimo"])

fig, ax = plt.subplots()
ax.scatter(livros["paginas"], livros["dias_emprestimo"], alpha=0.45, color="#3b6ea5")
xs = pd.Series([livros["paginas"].min(), livros["paginas"].max()])
ax.plot(xs, reg.intercept + reg.slope * xs, color="#c0562f",
        label=f"dias = {reg.intercept:.1f} + {reg.slope:.3f}·páginas  (R² = {reg.rvalue**2:.2f})")
ax.axhline(14, color="#2f8f5b", linestyle="--", label="Prazo atual (14 d)")
ax.set_title("Livros: páginas × dias emprestado")
ax.set_xlabel("Páginas")
ax.set_ylabel("Dias emprestado")
ax.legend()
fig.tight_layout()
fig.savefig("graficos/04_dispersao_regressao.png", dpi=150)

paginas_no_prazo = (14 - reg.intercept) / reg.slope
print(f"Coeficiente: +{reg.slope * 100:.1f} dias a cada 100 páginas | R² = {reg.rvalue**2:.2f}")
print(f"Em média, livros acima de ~{paginas_no_prazo:.0f} páginas passam do prazo de 14 dias.")

# %% [markdown]
# ## 6. Conclusões para o cliente
# Preencha com os números gerados acima (exemplos do que observar):
# - **Compras:** priorizar os gêneros do topo do ranking.
# - **Sazonalidade:** reforçar acervo/atendimento nos meses de pico (início de cada semestre).
# - **Prazo:** se a taxa de atraso de livros grandes é alta, avaliar prazo de 21 dias para livros acima do limite de páginas calculado na regressão.
