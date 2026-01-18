"use client";

import type { OnboardingMessage } from "@/types/onboarding";
import { InlineForm } from "./InlineForm";

interface OnboardingMessageBubbleProps {
  message: OnboardingMessage;
  onFormSubmit?: (values: Record<string, string | string[]>) => void;
  onQuickReplyClick?: (label: string, value: string) => void;
  isFormLoading?: boolean;
}

export function OnboardingMessageBubble({
  message,
  onFormSubmit,
  onQuickReplyClick,
  isFormLoading = false,
}: OnboardingMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in-up`}
      data-testid="onboarding-message"
    >
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm"
        }`}
      >
        {/* Message content */}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

        {/* Inline form */}
        {message.form && onFormSubmit && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <InlineForm config={message.form} onSubmit={onFormSubmit} isLoading={isFormLoading} />
          </div>
        )}

        {/* Quick replies */}
        {message.quickReplies && message.quickReplies.length > 0 && onQuickReplyClick && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => onQuickReplyClick(reply.label, reply.value)}
                className="px-3 py-1.5 text-sm font-medium bg-background border border-input rounded-full hover:bg-accent hover:border-primary/50 transition-colors animate-slide-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {reply.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
