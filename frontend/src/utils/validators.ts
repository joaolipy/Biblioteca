/**
 * Validações puras (sem dependência de Express/Sequelize).
 * Ficam isoladas para serem reaproveitadas na edição de usuário (Sprint 2)
 * e testadas facilmente.
 */

// ---------- E-mail ----------
// Regex pragmática: algo@dominio.tld (sem espaços, com pelo menos um ponto no domínio)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// ---------- CPF ----------
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function calcCpfDigit(base: string): number {
  // pesos: começa em (tamanho + 1) e decresce até 2
  let sum = 0;
  for (let i = 0; i < base.length; i++) {
    sum += Number(base[i]) * (base.length + 1 - i);
  }
  const rest = (sum * 10) % 11;
  return rest === 10 ? 0 : rest;
}

export function isValidCpf(cpf: string): boolean {
  const digits = onlyDigits(cpf);

  if (digits.length !== 11) return false;
  // rejeita sequências repetidas (111.111.111-11 passa no cálculo, mas é inválido)
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const d1 = calcCpfDigit(digits.slice(0, 9));
  const d2 = calcCpfDigit(digits.slice(0, 9) + d1);

  return d1 === Number(digits[9]) && d2 === Number(digits[10]);
}

// ---------- Senha ----------
export interface PasswordCheck {
  valid: boolean;
  /** Regras que NÃO foram atendidas, em linguagem amigável. */
  missing: string[];
}

export const PASSWORD_RULES: ReadonlyArray<{ label: string; test: (p: string) => boolean }> = [
  { label: "no mínimo 8 caracteres", test: (p) => p.length >= 8 },
  { label: "uma letra maiúscula", test: (p) => /[A-Z]/.test(p) },
  { label: "uma letra minúscula", test: (p) => /[a-z]/.test(p) },
  { label: "um número", test: (p) => /\d/.test(p) },
  { label: "um caractere especial (ex.: ! @ # $)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function checkPasswordStrength(password: string): PasswordCheck {
  const missing = PASSWORD_RULES.filter((rule) => !rule.test(password)).map((rule) => rule.label);
  return { valid: missing.length === 0, missing };
}
