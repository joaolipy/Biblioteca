import type { ReactNode } from "react";

type Props = {
  variant: "error" | "success";
  children: ReactNode;
};

export function Alert({ variant, children }: Props) {
  return (
    <div className={`alert alert-${variant}`} role={variant === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
