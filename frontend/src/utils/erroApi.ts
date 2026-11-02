import { isAxiosError } from "axios";

export interface ErroApi {
  /** Mensagem geral, amigável, para mostrar ao usuário. */
  mensagem: string;
  /** Erros por campo vindos da API (ex.: { email: "Este e-mail já está cadastrado." }). */
  campos: Record<string, string>;
}

interface CorpoErroApi {
  message?: string;
  errors?: Record<string, string>;
}

/** Converte qualquer erro de requisição em uma mensagem amigável. */
export function traduzirErroApi(error: unknown): ErroApi {
  if (!isAxiosError<CorpoErroApi>(error)) {
    return { mensagem: "Ocorreu um erro inesperado. Tente novamente.", campos: {} };
  }

  // Sem resposta: servidor fora do ar, sem internet ou timeout
  if (!error.response) {
    return {
      mensagem: "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      campos: {},
    };
  }

  const { status, data } = error.response;
  const campos = data?.errors ?? {};

  if (status === 400) {
    return { mensagem: "Alguns dados estão inválidos. Corrija os campos destacados.", campos };
  }
  if (status === 409) {
    return { mensagem: "Já existe um cadastro com os dados informados.", campos };
  }
  if (status >= 500) {
    return { mensagem: "O servidor está com problemas no momento. Tente novamente em instantes.", campos: {} };
  }

  return { mensagem: data?.message ?? "Não foi possível concluir a operação.", campos };
}
