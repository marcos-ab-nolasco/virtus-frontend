export function TypingIndicator() {
  return (
    <div
      data-testid="typing-indicator"
      className="inline-flex items-center gap-1 px-4 py-3 bg-muted rounded-2xl rounded-bl-sm"
      role="status"
    >
      <span className="sr-only">Digitando...</span>
      {[0, 150, 300].map((delay, index) => (
        <span
          key={index}
          data-testid="typing-dot"
          className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}
