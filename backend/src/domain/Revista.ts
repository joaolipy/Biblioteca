import { ValidacaoError } from "./errors/DominioError";
import { ItemAcervo } from "./ItemAcervo";

export class Revista extends ItemAcervo {
  #edicao: number;

  constructor(id: number, titulo: string, anoPublicacao: number, edicao: number) {
    super(id, titulo, anoPublicacao);
    this.#edicao = Revista.validarEdicao(edicao);
  }

  get edicao(): number {
    return this.#edicao;
  }

  set edicao(valor: number) {
    this.#edicao = Revista.validarEdicao(valor);
  }

  prazoEmprestimoEmDias(): number {
    return 7;
  }

  protected multaPorDiaDeAtraso(): number {
    return 0.75;
  }

  private static validarEdicao(valor: number): number {
    if (!Number.isInteger(valor) || valor < 1) {
      throw new ValidacaoError("Edição deve ser um inteiro maior ou igual a 1.");
    }
    return valor;
  }
}
