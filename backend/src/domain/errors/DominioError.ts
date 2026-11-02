/** Erro base do domínio da biblioteca. */
export class DominioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Dado fora do formato/limite aceito (ex.: título vazio, ano futuro). */
export class ValidacaoError extends DominioError {}

/** Operação que viola uma regra de negócio (ex.: emprestar item já emprestado). */
export class RegraDeNegocioError extends DominioError {}
