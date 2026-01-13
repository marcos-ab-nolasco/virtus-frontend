import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders spinner with default size", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("svg");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
  });

  it("renders with text label", () => {
    render(<LoadingSpinner text="Loading..." />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("applies small size classes", () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector("svg");
    expect(spinner).toHaveClass("h-4", "w-4");
  });

  it("applies medium size classes", () => {
    const { container } = render(<LoadingSpinner size="md" />);
    const spinner = container.querySelector("svg");
    expect(spinner).toHaveClass("h-8", "w-8");
  });

  it("applies large size classes", () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector("svg");
    expect(spinner).toHaveClass("h-12", "w-12");
  });

  it("applies extra large size classes", () => {
    const { container } = render(<LoadingSpinner size="xl" />);
    const spinner = container.querySelector("svg");
    expect(spinner).toHaveClass("h-16", "w-16");
  });

  it("applies custom className", () => {
    const { container } = render(
      <LoadingSpinner className="custom-class" />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("renders without text by default", () => {
    const { container } = render(<LoadingSpinner />);
    const text = container.querySelector("p");
    expect(text).not.toBeInTheDocument();
  });

  it("has correct color classes", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("svg");
    expect(spinner).toHaveClass("text-blue-600");
  });
});
