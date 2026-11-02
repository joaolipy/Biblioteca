import type { ReactNode } from "react";

type Props = {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
};

/** Moldura das telas públicas (cadastro, login). */
export function AuthLayout({ titulo, subtitulo, children }: Props) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <span className="brand">📚 Biblioteca</span>
          <h1>{titulo}</h1>
          {subtitulo && <p>{subtitulo}</p>}
        </header>
        {children}
      </section>
    </main>
  );
}
