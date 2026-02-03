import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  name: string;
}

export default function Input({
  label,
  error,
  name,
  type = "text",
  className,
  disabled,
  required,
  ...props
}: InputProps) {
  const inputId = `input-${name}`;

  const baseStyles =
    "w-full px-3 py-2 rounded-input border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-300/30 disabled:text-muted disabled:cursor-not-allowed font-body placeholder:text-muted bg-surface";

  const inputStyles = error
    ? "border-danger-text focus:border-danger-text focus:ring-danger-bg bg-danger-bg"
    : "border-gray-300 focus:border-slate-500 focus:ring-slate-500/20";

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-body font-medium text-slate-500 mb-1"
        >
          {label}
          {required && <span className="text-danger-text ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        disabled={disabled}
        required={required}
        className={twMerge(baseStyles, inputStyles, className)}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-danger-text font-body" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
