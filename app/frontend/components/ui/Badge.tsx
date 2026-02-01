import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  variant?: "success" | "error" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
  children: ReactNode;
  className?: string;
}

export default function Badge({
  variant = "neutral",
  size = "md",
  children,
  className,
}: BadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-pill font-body font-medium";

  const variantStyles = {
    success: "bg-success-bg text-teal-500",
    // Map error to danger for backwards compatibility
    error: "bg-danger-bg text-danger-text",
    danger: "bg-danger-bg text-danger-text",
    info: "bg-info-bg text-slate-500",
    neutral: "bg-gray-300 text-navy-900",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
  };

  return (
    <span className={twMerge(baseStyles, variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
}
