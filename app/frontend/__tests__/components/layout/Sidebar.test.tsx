import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Sidebar from "@/components/layout/Sidebar";

// Mock usePathname
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

describe("Sidebar", () => {
  it("renders navigation links", () => {
    render(<Sidebar />);

    expect(screen.getByRole("link", { name: /início/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /chat/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /planos/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /configurações/i })).toBeInTheDocument();
  });

  it("highlights active link", () => {
    render(<Sidebar />);

    const dashboardLink = screen.getByRole("link", { name: /início/i });
    // Active link should have specific styling
    expect(dashboardLink).toHaveClass("bg-primary-50");
  });

  it("applies correct href to links", () => {
    render(<Sidebar />);

    expect(screen.getByRole("link", { name: /início/i })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: /chat/i })).toHaveAttribute("href", "/dashboard/chat");
    expect(screen.getByRole("link", { name: /planos/i })).toHaveAttribute(
      "href",
      "/dashboard/plans"
    );
    expect(screen.getByRole("link", { name: /configurações/i })).toHaveAttribute(
      "href",
      "/settings"
    );
  });
});
