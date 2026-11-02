/** Contrato comum de tudo que pode ser emprestado no acervo. */
export interface Emprestavel {
  readonly disponivel: boolean;
  emprestar(): void;
  devolver(): void;
}
