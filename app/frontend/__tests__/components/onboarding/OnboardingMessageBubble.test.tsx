import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OnboardingMessageBubble } from "@/components/onboarding/OnboardingMessageBubble";
import type { OnboardingMessage } from "@/types/onboarding";

describe("OnboardingMessageBubble", () => {
  it("stagger-animates quick reply buttons", () => {
    const message: OnboardingMessage = {
      id: "msg-1",
      role: "assistant",
      content: "Escolha uma opcao",
      timestamp: new Date().toISOString(),
      quickReplies: [
        { label: "Opcao A", value: "a" },
        { label: "Opcao B", value: "b" },
      ],
    };

    render(<OnboardingMessageBubble message={message} onQuickReplyClick={() => undefined} />);

    const first = screen.getByRole("button", { name: "Opcao A" });
    const second = screen.getByRole("button", { name: "Opcao B" });

    expect(first).toHaveClass("animate-slide-in-up");
    expect(first).toHaveStyle({ animationDelay: "0ms" });
    expect(second).toHaveStyle({ animationDelay: "50ms" });
  });
});
