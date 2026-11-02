import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  type?: "button" | "submit";
  loading?: boolean;
  onClick?: () => void;
};

export function Button({ children, type = "button", loading = false, onClick }: Props) {
  return (
    <button type={type} className="btn btn-primary" disabled={loading} onClick={onClick}>
      {loading ? "Aguarde..." : children}
    </button>
  );
}
