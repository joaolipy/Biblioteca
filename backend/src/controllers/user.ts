import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../entities/user.model";
import {
  checkPasswordStrength,
  isValidCpf,
  isValidEmail,
  onlyDigits,
} from "../utils/validators";

type FieldErrors = Record<string, string>;

/**
 * Valida o corpo do cadastro. Retorna um objeto { campo: mensagem }.
 * Objeto vazio = tudo certo.
 */
function validateRegisterBody(body: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {};

  const nome = typeof body.nome === "string" ? body.nome.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const cpf = typeof body.cpf === "string" ? body.cpf : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!nome) errors.nome = "O nome é obrigatório.";

  if (!email) errors.email = "O e-mail é obrigatório.";
  else if (!isValidEmail(email)) errors.email = "Informe um e-mail válido.";

  if (!cpf) errors.cpf = "O CPF é obrigatório.";
  else if (!isValidCpf(cpf)) errors.cpf = "Informe um CPF válido.";

  if (!password) errors.password = "A senha é obrigatória.";
  else {
    const strength = checkPasswordStrength(password);
    if (!strength.valid) {
      errors.password = `Senha fraca. Falta: ${strength.missing.join(", ")}.`;
    }
  }

  return errors;
}

// Cadastro de usuário
export async function createUser(req: Request, res: Response) {
  const body = (req.body ?? {}) as Record<string, unknown>;

  const errors = validateRegisterBody(body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Dados inválidos.", errors });
  }

  const nome = (body.nome as string).trim();
  const email = (body.email as string).trim().toLowerCase();
  const cpf = onlyDigits(body.cpf as string);
  const password = body.password as string;

  // E-mail e CPF precisam ser únicos
  const emailInUse = await User.findOne({ where: { email } });
  if (emailInUse) {
    return res
      .status(409)
      .json({ message: "Dados já cadastrados.", errors: { email: "Este e-mail já está cadastrado." } });
  }

  const cpfInUse = await User.findOne({ where: { cpf } });
  if (cpfInUse) {
    return res
      .status(409)
      .json({ message: "Dados já cadastrados.", errors: { cpf: "Este CPF já está cadastrado." } });
  }

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const passwordHashed = await bcrypt.hash(password, saltRounds);

  const user = await User.create({ nome, email, cpf, password: passwordHashed });

  return res.status(201).json(user.convertToResponse());
}
