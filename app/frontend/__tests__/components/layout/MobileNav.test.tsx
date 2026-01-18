import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MobileNav from "@/components/layout/MobileNav";

// Mock usePathname
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

describe("MobileNav", () => {
  it("renders navigation links", () => {
    render(<MobileNav />);

    expect(screen.getByRole("link", { name: /início/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /chat/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /planos/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /configurações/i })).toBeInTheDocument();
  });

  it("highlights active link", () => {
    render(<MobileNav />);

    const dashboardLink = screen.getByRole("link", { name: /início/i });
    // Active link should have specific text color
    expect(dashboardLink).toHaveClass("text-primary-600");
  });

  it("renders icons for each link", () => {
    render(<MobileNav />);

    // Each link should have an icon (SVG element)
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link.querySelector("svg")).toBeInTheDocument();
    });
  });

  it("is positioned at bottom of screen", () => {
    const { container } = render(<MobileNav />);
    const nav = container.firstChild;
    expect(nav).toHaveClass("fixed", "bottom-0");
  });
});
