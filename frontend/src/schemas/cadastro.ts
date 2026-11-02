import { z } from "zod";
import { checkPasswordStrength, isValidCpf, isValidEmail } from "../utils/validators";

export const cadastroSchema = z.object({
  nome: z.string().trim().min(1, "O nome é obrigatório."),
  email: z
    .string()
    .trim()
    .min(1, "O e-mail é obrigatório.")
    .refine(isValidEmail, "Informe um e-mail válido."),
  cpf: z
    .string()
    .min(1, "O CPF é obrigatório.")
    .refine(isValidCpf, "Informe um CPF válido."),
  password: z.string().superRefine((senha, ctx) => {
    if (!senha) {
      ctx.addIssue({ code: "custom", message: "A senha é obrigatória." });
      return;
    }
    const { valid, missing } = checkPasswordStrength(senha);
    if (!valid) {
      ctx.addIssue({ code: "custom", message: `Senha fraca. Falta: ${missing.join(", ")}.` });
    }
  }),
  confirmPassword: z.string().min(1, "Confirme a senha."),
});

export type CadastroForm = z.infer<typeof cadastroSchema>;
export type CadastroErros = Partial<Record<keyof CadastroForm, string>>;

/** Valida o formulário inteiro e devolve { campo: mensagem }. Vazio = válido. */
export function validarCadastro(valores: CadastroForm): CadastroErros {
  const erros: CadastroErros = {};

  const resultado = cadastroSchema.safeParse(valores);
  if (!resultado.success) {
    for (const issue of resultado.error.issues) {
      const campo = issue.path[0] as keyof CadastroForm;
      if (!erros[campo]) erros[campo] = issue.message;
    }
  }

  // Verificação dupla de senha
  if (!erros.confirmPassword && valores.password !== valores.confirmPassword) {
    erros.confirmPassword = "As senhas não coincidem.";
  }

  return erros;
}
