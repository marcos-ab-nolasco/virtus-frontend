import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  shadow?: boolean;
}

export default function Card({ children, className, padding = "md", shadow = true }: CardProps) {
  const baseStyles =
    "bg-surface border border-gray-300 rounded-card dark:bg-surface dark:border-gray-300/20";

  const paddingStyles = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const shadowStyles = shadow ? "shadow-soft" : "";

  return (
    <div className={twMerge(baseStyles, paddingStyles[padding], shadowStyles, className)}>
      {children}
    </div>
  );
}
