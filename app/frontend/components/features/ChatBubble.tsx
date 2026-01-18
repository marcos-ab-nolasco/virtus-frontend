import { twMerge } from "tailwind-merge";

interface ChatBubbleProps {
  message: string;
  role: "user" | "agent";
  timestamp?: string;
  isLoading?: boolean;
}

export default function ChatBubble({ message, role, timestamp, isLoading }: ChatBubbleProps) {
  const isUser = role === "user";

  if (isLoading) {
    return (
      <div className="flex items-start gap-3 mb-4">
        <div className="flex flex-col">
          <div className="bg-neutral-100 text-neutral-900 rounded-lg px-4 py-3 max-w-xs sm:max-w-md">
            <div className="flex gap-1">
              <div
                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                role="presentation"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                role="presentation"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                role="presentation"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={twMerge("flex items-start gap-3 mb-4", isUser ? "justify-end" : "justify-start")}
    >
      <div className="flex flex-col">
        <div
          className={twMerge(
            "rounded-lg px-4 py-3 max-w-xs sm:max-w-md break-words",
            isUser ? "bg-primary-100 text-primary-900" : "bg-neutral-100 text-neutral-900"
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </div>
        {timestamp && (
          <span
            className={twMerge(
              "text-xs text-neutral-500 mt-1",
              isUser ? "text-right" : "text-left"
            )}
          >
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
