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
    "font-heading font-medium rounded-pill transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-slate-500 text-bone-50 hover:bg-slate-600 focus:ring-slate-500",
    secondary:
      "border-2 border-slate-500 text-slate-500 hover:bg-slate-500/10 focus:ring-slate-500",
    ghost: "text-slate-500 hover:bg-slate-500/10 focus:ring-slate-500",
    danger: "bg-teal-500 text-bone-50 hover:bg-teal-600 focus:ring-teal-500",
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
