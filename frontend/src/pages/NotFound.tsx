import { Link } from "react-router-dom";
import { AuthLayout } from "../componentes/AuthLayout";

export function NotFoundPage() {
  return (
    <AuthLayout titulo="Página não encontrada">
      <p className="auth-footer">
        <Link to="/cadastro">Ir para o cadastro</Link>
      </p>
    </AuthLayout>
  );
}
