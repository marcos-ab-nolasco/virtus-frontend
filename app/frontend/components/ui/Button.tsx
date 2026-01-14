import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-primary-500 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary:
      "border-2 border-primary-500 text-primary-700 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-primary-700 hover:bg-primary-50 focus:ring-primary-500",
    danger: "bg-error-500 text-white hover:bg-error-700 focus:ring-error-500",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={twMerge(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
