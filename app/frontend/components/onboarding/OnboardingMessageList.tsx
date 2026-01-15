"use client";

import { useEffect, useRef } from "react";
import type { OnboardingMessage } from "@/types/onboarding";
import { OnboardingMessageBubble } from "./OnboardingMessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface OnboardingMessageListProps {
  messages: OnboardingMessage[];
  isTyping: boolean;
  onFormSubmit?: (values: Record<string, string | string[]>) => void;
  onQuickReplyClick?: (label: string, value: string) => void;
  isFormLoading?: boolean;
}

export function OnboardingMessageList({
  messages,
  isTyping,
  onFormSubmit,
  onQuickReplyClick,
  isFormLoading = false,
}: OnboardingMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current?.scrollIntoView) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="onboarding-message-list">
      {messages.map((message, index) => (
        <OnboardingMessageBubble
          key={message.id || index}
          message={message}
          onFormSubmit={onFormSubmit}
          onQuickReplyClick={onQuickReplyClick}
          isFormLoading={isFormLoading}
        />
      ))}

      {isTyping && (
        <div className="flex justify-start">
          <TypingIndicator />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
