import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatBubble from "@/components/features/ChatBubble";

describe("ChatBubble", () => {
  it("renders message correctly", () => {
    render(<ChatBubble message="Hello world" role="user" />);
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });

  it("applies user styles when role is user", () => {
    render(<ChatBubble message="User message" role="user" />);
    const bubble = screen.getByText(/user message/i).closest("div");
    expect(bubble).toHaveClass("bg-primary-100");
  });

  it("applies agent styles when role is agent", () => {
    render(<ChatBubble message="Agent message" role="agent" />);
    const bubble = screen.getByText(/agent message/i).closest("div");
    expect(bubble).toHaveClass("bg-neutral-100");
  });

  it("displays timestamp when provided", () => {
    const timestamp = "10:30";
    render(<ChatBubble message="Message" role="user" timestamp={timestamp} />);
    expect(screen.getByText(timestamp)).toBeInTheDocument();
  });

  it("shows typing indicator when isLoading is true", () => {
    render(<ChatBubble message="" role="agent" isLoading={true} />);
    // Typing indicator should have three dots
    const dots = screen.getAllByRole("presentation", { hidden: true });
    expect(dots.length).toBeGreaterThanOrEqual(3);
  });

  it("does not show timestamp when not provided", () => {
    render(<ChatBubble message="Message" role="user" />);
    // Should not have any timestamp text
    const bubble = screen.getByText(/message/i).parentElement;
    expect(bubble?.textContent).toBe("Message");
  });
});
