import { PASSWORD_RULES } from "../utils/validators";

type Props = { senha: string };

/** Mostra, em tempo real, quais regras de senha já foram atendidas. */
export function PasswordChecklist({ senha }: Props) {
  return (
    <ul className="password-rules" aria-label="Requisitos da senha">
      {PASSWORD_RULES.map((regra) => {
        const ok = regra.test(senha);
        return (
          <li key={regra.label} className={ok ? "rule-ok" : "rule-pending"}>
            {ok ? "✓" : "○"} {regra.label}
          </li>
        );
      })}
    </ul>
  );
}
