import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TypingIndicator } from "@/components/onboarding/TypingIndicator";

describe("TypingIndicator", () => {
  it("renders three animated dots", () => {
    render(<TypingIndicator />);

    const dots = screen.getAllByTestId("typing-dot");
    expect(dots).toHaveLength(3);
  });

  it("renders within a message bubble style container", () => {
    render(<TypingIndicator />);

    const container = screen.getByTestId("typing-indicator");
    expect(container).toHaveClass("bg-muted");
  });

  it("applies animation classes to dots", () => {
    render(<TypingIndicator />);

    const dots = screen.getAllByTestId("typing-dot");
    dots.forEach((dot) => {
      expect(dot).toHaveClass("animate-bounce");
    });
  });

  it("has staggered animation delays", () => {
    render(<TypingIndicator />);

    const dots = screen.getAllByTestId("typing-dot");
    expect(dots[0]).toHaveStyle({ animationDelay: "0ms" });
    expect(dots[1]).toHaveStyle({ animationDelay: "150ms" });
    expect(dots[2]).toHaveStyle({ animationDelay: "300ms" });
  });

  it("has accessible label for screen readers", () => {
    render(<TypingIndicator />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Digitando...")).toBeInTheDocument();
  });
});
