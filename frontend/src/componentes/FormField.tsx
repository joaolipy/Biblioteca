import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (valor: string) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "email";
  error?: string;
  disabled?: boolean;
};

/** Campo genérico (label + input + mensagem de erro), reutilizável em qualquer formulário. */
export function FormField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  error,
  disabled,
}: Props) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-erro` : undefined}
        className={error ? "input input-error" : "input"}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />
      {error && (
        <span id={`${id}-erro`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
