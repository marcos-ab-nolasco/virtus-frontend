import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import MessageList from "@/components/features/MessageList";

describe("MessageList", () => {
  const mockMessages = [
    { id: "1", message: "Hello", role: "user" as const, timestamp: "10:00" },
    { id: "2", message: "Hi there!", role: "agent" as const, timestamp: "10:01" },
  ];

  // Mock scrollIntoView
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all messages", () => {
    render(<MessageList messages={mockMessages} />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
    expect(screen.getByText(/hi there!/i)).toBeInTheDocument();
  });

  it("renders empty state when no messages", () => {
    render(<MessageList messages={[]} />);
    const list = screen.getByRole("list", { hidden: true });
    expect(list.children.length).toBe(0);
  });

  it("shows typing indicator when isAgentTyping is true", () => {
    render(<MessageList messages={mockMessages} isAgentTyping={true} />);
    // Should have loading state with animated dots
    const dots = screen.getAllByRole("presentation", { hidden: true });
    expect(dots.length).toBeGreaterThanOrEqual(3);
  });

  it("does not show typing indicator when isAgentTyping is false", () => {
    render(<MessageList messages={mockMessages} isAgentTyping={false} />);
    // Should only have messages, no typing indicator
    expect(screen.queryByRole("presentation", { hidden: true })).not.toBeInTheDocument();
  });

  it("calls scrollIntoView on mount", () => {
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    render(<MessageList messages={mockMessages} />);

    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it("calls scrollIntoView when new message is added", () => {
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    const { rerender } = render(<MessageList messages={mockMessages} />);

    const updatedMessages = [
      ...mockMessages,
      { id: "3", message: "New message", role: "user" as const, timestamp: "10:02" },
    ];

    rerender(<MessageList messages={updatedMessages} />);

    expect(scrollIntoViewMock).toHaveBeenCalled();
  });
});
