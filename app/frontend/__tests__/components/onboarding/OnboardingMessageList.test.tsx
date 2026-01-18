import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { OnboardingMessageList } from "@/components/onboarding/OnboardingMessageList";
import type { OnboardingMessage } from "@/types/onboarding";

describe("OnboardingMessageList", () => {
  const messages: OnboardingMessage[] = [
    {
      id: "msg-1",
      role: "assistant",
      content: "Bem-vindo!",
      timestamp: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("scrolls smoothly to bottom on render", () => {
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    render(<OnboardingMessageList messages={messages} isTyping={false} />);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("shows typing indicator and loading skeleton when typing", () => {
    render(<OnboardingMessageList messages={messages} isTyping={true} />);

    expect(screen.getByTestId("typing-indicator")).toBeInTheDocument();
    expect(screen.getByTestId("onboarding-response-skeleton")).toBeInTheDocument();
  });
});
