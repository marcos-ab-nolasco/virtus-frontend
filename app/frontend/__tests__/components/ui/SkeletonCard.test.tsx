import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  SkeletonCard,
  SkeletonText,
  SkeletonAvatar,
} from "@/components/ui/SkeletonCard";

describe("SkeletonCard", () => {
  it("renders skeleton card structure", () => {
    const { container } = render(<SkeletonCard />);
    const card = container.firstChild;
    expect(card).toHaveClass("bg-white", "rounded-lg", "shadow", "p-6");
  });

  it("has pulse animation", () => {
    const { container } = render(<SkeletonCard />);
    const card = container.firstChild;
    expect(card).toHaveClass("animate-pulse");
  });

  it("applies custom className", () => {
    const { container } = render(<SkeletonCard className="custom-class" />);
    const card = container.firstChild;
    expect(card).toHaveClass("custom-class");
  });

  it("renders multiple skeleton lines", () => {
    const { container } = render(<SkeletonCard />);
    const lines = container.querySelectorAll(".bg-gray-200");
    expect(lines.length).toBeGreaterThan(1);
  });
});

describe("SkeletonText", () => {
  it("renders skeleton text element", () => {
    const { container } = render(<SkeletonText />);
    const text = container.firstChild;
    expect(text).toHaveClass("h-4", "bg-gray-200", "rounded", "animate-pulse");
  });

  it("applies custom className", () => {
    const { container } = render(<SkeletonText className="w-full" />);
    const text = container.firstChild;
    expect(text).toHaveClass("w-full");
  });
});

describe("SkeletonAvatar", () => {
  it("renders small avatar", () => {
    const { container } = render(<SkeletonAvatar size="sm" />);
    const avatar = container.firstChild;
    expect(avatar).toHaveClass("h-8", "w-8", "rounded-full", "animate-pulse");
  });

  it("renders medium avatar", () => {
    const { container } = render(<SkeletonAvatar size="md" />);
    const avatar = container.firstChild;
    expect(avatar).toHaveClass("h-12", "w-12");
  });

  it("renders large avatar", () => {
    const { container } = render(<SkeletonAvatar size="lg" />);
    const avatar = container.firstChild;
    expect(avatar).toHaveClass("h-16", "w-16");
  });

  it("renders medium size by default", () => {
    const { container } = render(<SkeletonAvatar />);
    const avatar = container.firstChild;
    expect(avatar).toHaveClass("h-12", "w-12");
  });

  it("has circular shape", () => {
    const { container } = render(<SkeletonAvatar />);
    const avatar = container.firstChild;
    expect(avatar).toHaveClass("rounded-full");
  });
});
