import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  name: string;
}

export default function Input({
  label,
  error,
  name,
  type = 'text',
  className,
  disabled,
  required,
  ...props
}: InputProps) {
  const inputId = `input-${name}`;

  const baseStyles = 'w-full px-3 py-2 rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed';

  const inputStyles = error
    ? 'border-error-500 focus:border-error-600 focus:ring-error-200'
    : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-200';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        disabled={disabled}
        required={required}
        className={twMerge(baseStyles, inputStyles, className)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-sm text-error-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
