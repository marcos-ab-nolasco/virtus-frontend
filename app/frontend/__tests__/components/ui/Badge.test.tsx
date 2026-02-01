import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders children correctly", () => {
    render(<Badge>Badge text</Badge>);
    expect(screen.getByText(/badge text/i)).toBeInTheDocument();
  });

  it("applies success variant styles", () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText(/success/i);
    expect(badge).toHaveClass("bg-success-bg");
    expect(badge).toHaveClass("text-teal-500");
  });

  it("applies error variant styles", () => {
    render(<Badge variant="error">Error</Badge>);
    const badge = screen.getByText(/error/i);
    expect(badge).toHaveClass("bg-danger-bg");
    expect(badge).toHaveClass("text-danger-text");
  });

  it("applies info variant styles", () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByText(/info/i);
    expect(badge).toHaveClass("bg-info-bg");
    expect(badge).toHaveClass("text-slate-500");
  });

  it("applies neutral variant styles", () => {
    render(<Badge variant="neutral">Neutral</Badge>);
    const badge = screen.getByText(/neutral/i);
    expect(badge).toHaveClass("bg-gray-300");
    expect(badge).toHaveClass("text-navy-900");
  });

  it("applies small size styles", () => {
    render(<Badge size="sm">Small</Badge>);
    const badge = screen.getByText(/small/i);
    expect(badge).toHaveClass("text-xs");
  });

  it("applies medium size styles", () => {
    render(<Badge size="md">Medium</Badge>);
    const badge = screen.getByText(/medium/i);
    expect(badge).toHaveClass("text-sm");
  });

  it("applies custom className", () => {
    render(<Badge className="custom-badge">Custom</Badge>);
    const badge = screen.getByText(/custom/i);
    expect(badge).toHaveClass("custom-badge");
  });
});
