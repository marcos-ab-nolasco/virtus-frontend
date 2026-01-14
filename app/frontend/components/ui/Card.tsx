import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  shadow?: boolean;
}

export default function Card({ children, className, padding = "md", shadow = true }: CardProps) {
  const baseStyles = "bg-white border border-neutral-200 rounded-lg";

  const paddingStyles = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const shadowStyles = shadow ? "shadow-md" : "";

  return (
    <div className={twMerge(baseStyles, paddingStyles[padding], shadowStyles, className)}>
      {children}
    </div>
  );
}
