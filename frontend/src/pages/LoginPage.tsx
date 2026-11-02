import { Link, useLocation } from "react-router-dom";
import { Alert } from "../componentes/Alert";
import { AuthLayout } from "../componentes/AuthLayout";

type EstadoRota = { cadastroConcluido?: boolean } | null;

/**
 * Placeholder da Sprint 1: existe para receber o redirecionamento do cadastro.
 * O formulário de login (e-mail/senha, JWT, localStorage) entra na Sprint 2.
 */
export function LoginPage() {
  const location = useLocation();
  const estado = location.state as EstadoRota;

  return (
    <AuthLayout titulo="Entrar">
      {estado?.cadastroConcluido && (
        <Alert variant="success">Cadastro realizado com sucesso! Faça login para continuar.</Alert>
      )}
      <p className="auth-footer">
        O login será implementado na próxima etapa. <Link to="/cadastro">Voltar ao cadastro</Link>
      </p>
    </AuthLayout>
  );
}
