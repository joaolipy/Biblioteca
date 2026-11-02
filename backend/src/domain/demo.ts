/**
 * Demonstração do domínio (Tech Forge - Sprint 1).
 * Rodar: npm run demo:domain
 */
import { DominioError } from "./errors/DominioError";
import { ItemAcervo } from "./ItemAcervo";
import { Leitor } from "./Leitor";
import { Livro } from "./Livro";
import { Revista } from "./Revista";

function tentar(descricao: string, acao: () => void): void {
  try {
    acao();
    console.log(`✔ ${descricao}`);
  } catch (erro) {
    if (erro instanceof DominioError) {
      console.log(`✖ ${descricao} -> ${erro.name}: ${erro.message}`);
    } else {
      throw erro;
    }
  }
}

const livro = new Livro(1, "Dom Casmurro", 1899, "Machado de Assis", "978-85-359-0277-5");
const revista = new Revista(2, "Superinteressante", 2024, 450);
const leitor = new Leitor(1, "Ana Souza", "ANA@exemplo.com", "529.982.247-25");

console.log(`Leitor: ${leitor.nome} | ${leitor.email} | ${leitor.cpfFormatado}`);

// Acesso controlado: setters validam
tentar("trocar título válido", () => {
  livro.titulo = "Dom Casmurro (edição comentada)";
});
tentar("trocar título vazio", () => {
  livro.titulo = "   ";
});
tentar("ano de publicação no futuro", () => {
  livro.anoPublicacao = 3000;
});
tentar("e-mail inválido no leitor", () => {
  leitor.email = "sem-arroba";
});

// Estado protegido: disponibilidade só muda por regra de negócio
tentar("emprestar livro", () => livro.emprestar());
tentar("emprestar o mesmo livro de novo", () => livro.emprestar());
tentar("devolver livro", () => livro.devolver());

// Polimorfismo: cada item define prazo e multa
const acervo: ItemAcervo[] = [livro, revista];
for (const item of acervo) {
  console.log(
    `${item.titulo}: prazo ${item.prazoEmprestimoEmDias()} dias | multa de 3 dias = R$ ${item.calcularMulta(3).toFixed(2)}`,
  );
}
