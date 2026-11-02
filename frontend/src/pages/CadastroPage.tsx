import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { Alert } from "../componentes/Alert";
import { AuthLayout } from "../componentes/AuthLayout";
import { Button } from "../componentes/Button";
import { FormField } from "../componentes/FormField";
import { PasswordChecklist } from "../componentes/PasswordChecklist";
import { validarCadastro, type CadastroErros, type CadastroForm } from "../schemas/cadastro";
import { traduzirErroApi } from "../utils/erroApi";
import { mascararCpf } from "../utils/formatar";

const FORM_INICIAL: CadastroForm = {
  nome: "",
  email: "",
  cpf: "",
  password: "",
  confirmPassword: "",
};

export function CadastroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CadastroForm>(FORM_INICIAL);
  const [erros, setErros] = useState<CadastroErros>({});
  const [erroGeral, setErroGeral] = useState("");
  const [loading, setLoading] = useState(false);

  function atualizar(campo: keyof CadastroForm, valor: string) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    // limpa o erro do campo assim que o usuário volta a digitar
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  }

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    setErroGeral("");

    const errosLocais = validarCadastro(form);
    if (Object.keys(errosLocais).length > 0) {
      setErros(errosLocais);
      return;
    }

    setLoading(true);
    try {
      await api.post("/users", {
        nome: form.nome.trim(),
        email: form.email.trim(),
        cpf: form.cpf,
        password: form.password,
      });

      // Redireciona para o login após o cadastro
      navigate("/login", { state: { cadastroConcluido: true } });
    } catch (error) {
      const { mensagem, campos } = traduzirErroApi(error);
      setErroGeral(mensagem);
      setErros((atual) => ({ ...atual, ...campos }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout titulo="Criar conta" subtitulo="Preencha os dados para se cadastrar na biblioteca.">
      <form onSubmit={onSubmit} noValidate className="auth-form">
        {erroGeral && <Alert variant="error">{erroGeral}</Alert>}

        <FormField
          id="nome"
          label="Nome"
          value={form.nome}
          onChange={(v) => atualizar("nome", v)}
          autoComplete="name"
          error={erros.nome}
          disabled={loading}
        />
        <FormField
          id="email"
          label="E-mail"
          type="email"
          inputMode="email"
          value={form.email}
          onChange={(v) => atualizar("email", v)}
          autoComplete="email"
          placeholder="voce@exemplo.com"
          error={erros.email}
          disabled={loading}
        />
        <FormField
          id="cpf"
          label="CPF"
          inputMode="numeric"
          value={form.cpf}
          onChange={(v) => atualizar("cpf", mascararCpf(v))}
          placeholder="000.000.000-00"
          error={erros.cpf}
          disabled={loading}
        />
        <FormField
          id="password"
          label="Senha"
          type="password"
          value={form.password}
          onChange={(v) => atualizar("password", v)}
          autoComplete="new-password"
          error={erros.password}
          disabled={loading}
        />
        <PasswordChecklist senha={form.password} />
        <FormField
          id="confirmPassword"
          label="Confirmar senha"
          type="password"
          value={form.confirmPassword}
          onChange={(v) => atualizar("confirmPassword", v)}
          autoComplete="new-password"
          error={erros.confirmPassword}
          disabled={loading}
        />

        <Button type="submit" loading={loading}>
          Cadastrar
        </Button>

        <p className="auth-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
