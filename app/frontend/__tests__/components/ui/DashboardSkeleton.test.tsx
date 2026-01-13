import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DashboardSkeleton } from "@/components/ui/DashboardSkeleton";

describe("DashboardSkeleton", () => {
  it("renders dashboard skeleton structure", () => {
    const { container } = render(<DashboardSkeleton />);
    const wrapper = container.querySelector(".min-h-screen");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders navbar skeleton", () => {
    const { container } = render(<DashboardSkeleton />);
    const nav = container.querySelector("nav");
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass("bg-white", "shadow-sm");
  });

  it("renders navbar elements with pulse animation", () => {
    const { container } = render(<DashboardSkeleton />);
    const navElements = container.querySelectorAll("nav .animate-pulse");
    expect(navElements.length).toBeGreaterThan(0);
  });

  it("renders main content area", () => {
    const { container } = render(<DashboardSkeleton />);
    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();
  });

  it("renders grid layout for feature cards", () => {
    const { container } = render(<DashboardSkeleton />);
    const grid = container.querySelector(".grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass("grid-cols-1", "md:grid-cols-2");
  });

  it("renders skeleton cards", () => {
    const { container } = render(<DashboardSkeleton />);
    const cards = container.querySelectorAll(".bg-white.rounded-lg.shadow");
    // Should have at least 1 user info card + 2 feature cards
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it("renders info banner skeleton", () => {
    const { container } = render(<DashboardSkeleton />);
    const banner = container.querySelector(".border.border-gray-200");
    expect(banner).toBeInTheDocument();
  });

  it("matches responsive design patterns", () => {
    const { container } = render(<DashboardSkeleton />);
    const responsiveGrid = container.querySelector(".md\\:grid-cols-2");
    expect(responsiveGrid).toBeInTheDocument();
  });

  it("has proper spacing classes", () => {
    const { container } = render(<DashboardSkeleton />);
    const main = container.querySelector("main");
    expect(main).toHaveClass("py-8");
  });
});
