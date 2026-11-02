import { RegraDeNegocioError, ValidacaoError } from "./errors/DominioError";
import type { Emprestavel } from "./Emprestavel";

/**
 * Item genérico do acervo (Livro, Revista...).
 *
 * ENCAPSULAMENTO: todo estado é privado nativo (#campo). Fora da classe só se
 * chega nele por getters/setters ou por métodos de negócio.
 *
 * ACESSO CONTROLADO: só existe setter onde há validação (título, ano).
 * `id` e `disponivel` NÃO têm setter: o estado de disponibilidade só muda
 * por emprestar()/devolver(), que aplicam a regra de negócio.
 */
export abstract class ItemAcervo implements Emprestavel {
  readonly #id: number;
  #titulo: string;
  #anoPublicacao: number;
  #disponivel = true;

  constructor(id: number, titulo: string, anoPublicacao: number) {
    this.#id = id;
    // passa pelos setters para reaproveitar as validações
    this.#titulo = this.validarTitulo(titulo);
    this.#anoPublicacao = this.validarAno(anoPublicacao);
  }

  // ---------- Acesso controlado ----------
  get id(): number {
    return this.#id;
  }

  get titulo(): string {
    return this.#titulo;
  }

  set titulo(valor: string) {
    this.#titulo = this.validarTitulo(valor);
  }

  get anoPublicacao(): number {
    return this.#anoPublicacao;
  }

  set anoPublicacao(valor: number) {
    this.#anoPublicacao = this.validarAno(valor);
  }

  get disponivel(): boolean {
    return this.#disponivel;
  }

  // ---------- Regras de negócio (mudam o estado de forma segura) ----------
  emprestar(): void {
    if (!this.#disponivel) {
      throw new RegraDeNegocioError(`"${this.#titulo}" já está emprestado.`);
    }
    this.#disponivel = false;
  }

  devolver(): void {
    if (this.#disponivel) {
      throw new RegraDeNegocioError(`"${this.#titulo}" não está emprestado.`);
    }
    this.#disponivel = true;
  }

  // ---------- Polimorfismo: cada tipo de item define a sua regra ----------
  abstract prazoEmprestimoEmDias(): number;
  protected abstract multaPorDiaDeAtraso(): number;

  calcularMulta(diasDeAtraso: number): number {
    if (!Number.isInteger(diasDeAtraso) || diasDeAtraso < 0) {
      throw new ValidacaoError("Dias de atraso deve ser um inteiro maior ou igual a 0.");
    }
    return diasDeAtraso * this.multaPorDiaDeAtraso();
  }

  // ---------- Helpers protegidos (reuso pelas subclasses) ----------
  protected exigirTexto(valor: string, campo: string): string {
    const limpo = valor?.trim();
    if (!limpo) {
      throw new ValidacaoError(`${campo} é obrigatório.`);
    }
    return limpo;
  }

  private validarTitulo(valor: string): string {
    return this.exigirTexto(valor, "Título");
  }

  private validarAno(valor: number): number {
    const anoAtual = new Date().getFullYear();
    if (!Number.isInteger(valor) || valor < 1450 || valor > anoAtual) {
      throw new ValidacaoError(`Ano de publicação deve estar entre 1450 e ${anoAtual}.`);
    }
    return valor;
  }
}
