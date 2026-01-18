"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingChat } from "@/hooks/useOnboardingChat";
import { ProgressIndicator } from "./ProgressIndicator";
import { OnboardingMessageList } from "./OnboardingMessageList";
import { OnboardingComplete } from "./OnboardingComplete";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

export function OnboardingPage() {
  const router = useRouter();
  const { refreshOnboardingStatus } = useAuth();
  const {
    messages,
    status,
    currentStep,
    progressPercent,
    isLoading,
    isSending,
    isTyping,
    error,
    startOnboarding,
    sendMessage,
    sendQuickReply,
    getStatus,
    clearError,
  } = useOnboardingChat();

  const [inputValue, setInputValue] = useState("");
  const [initializing, setInitializing] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Initialize onboarding
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const response = await getStatus();
        if (response.status === "COMPLETED") {
          await refreshOnboardingStatus().catch(() => undefined);
          setIsRedirecting(true);
          router.replace("/dashboard");
          return;
        }

        await refreshOnboardingStatus().catch(() => undefined);
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : "Erro ao carregar onboarding";
          setInitError(message);
          setInitializing(false);
        }
        return;
      }

      if (!mounted) return;
      setInitializing(false);
    };

    init();

    return () => {
      mounted = false;
    };
  }, [getStatus, router]);

  // Start or resume onboarding when status is NOT_STARTED or IN_PROGRESS
  useEffect(() => {
    if (!initializing && !initError && (status === "NOT_STARTED" || status === "IN_PROGRESS")) {
      startOnboarding();
    }
  }, [initializing, status, initError, startOnboarding]);

  // Show completion screen when done
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (status === "COMPLETED") {
      setShowCompletion(true);
    }
  }, [status]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isSending) return;

    const message = inputValue.trim();
    setInputValue("");
    await sendMessage(message);
  }, [inputValue, isSending, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFormSubmit = useCallback(
    async (values: Record<string, string | string[]>) => {
      // Send form values as JSON string
      const message = JSON.stringify(values);
      await sendMessage(message);
    },
    [sendMessage]
  );

  const handleQuickReplyClick = useCallback(
    async (label: string, value: string) => {
      await sendQuickReply(label, value);
    },
    [sendQuickReply]
  );

  // Loading state
  if (initializing || isRedirecting) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-background"
        data-testid="onboarding-loading"
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
        <p className="text-destructive">Erro ao carregar onboarding</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Completion state
  if (showCompletion && !isRedirecting) {
    return <OnboardingComplete />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header with progress */}
      <header className="flex-shrink-0 border-b bg-card">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-lg font-semibold">Virtus</h1>
            <span className="text-sm text-muted-foreground">Configuracao inicial</span>
          </div>
          <ProgressIndicator
            progressPercent={progressPercent}
            currentStep={currentStep ?? undefined}
          />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-2xl mx-auto h-full flex flex-col">
          <OnboardingMessageList
            messages={messages}
            isTyping={isTyping}
            onFormSubmit={handleFormSubmit}
            onQuickReplyClick={handleQuickReplyClick}
            isFormLoading={isSending}
          />
        </div>
      </div>

      {/* Input */}
      <footer className="flex-shrink-0 border-t bg-card">
        <div className="max-w-2xl mx-auto p-4">
          {error && (
            <div className="mb-3 px-3 py-2 bg-destructive/10 text-destructive text-sm rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button onClick={clearError} className="text-xs underline">
                Fechar
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua resposta..."
              className="flex-1 px-4 py-3 text-sm border rounded-xl resize-none bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={1}
              disabled={isSending || isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending || isLoading}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Enviar"
            >
              {isSending ? <LoadingSpinner size="sm" /> : "Enviar"}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground text-center">
            Pressione Enter para enviar
          </p>
        </div>
      </footer>
    </div>
  );
}
