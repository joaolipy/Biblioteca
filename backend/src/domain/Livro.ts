import { ItemAcervo } from "./ItemAcervo";

export class Livro extends ItemAcervo {
  readonly #isbn: string;
  #autor: string;

  constructor(id: number, titulo: string, anoPublicacao: number, autor: string, isbn: string) {
    super(id, titulo, anoPublicacao);
    this.#autor = this.exigirTexto(autor, "Autor");
    this.#isbn = this.exigirTexto(isbn, "ISBN");
  }

  get autor(): string {
    return this.#autor;
  }

  set autor(valor: string) {
    this.#autor = this.exigirTexto(valor, "Autor");
  }

  // ISBN é identificador: só leitura
  get isbn(): string {
    return this.#isbn;
  }

  prazoEmprestimoEmDias(): number {
    return 14;
  }

  protected multaPorDiaDeAtraso(): number {
    return 1.5;
  }
}
