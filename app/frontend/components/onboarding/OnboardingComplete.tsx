"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface OnboardingCompleteProps {
  onContinue?: () => void;
}

export function OnboardingComplete({ onContinue }: OnboardingCompleteProps) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    void refreshUser().catch(() => undefined);
  }, [refreshUser]);

  const handleContinue = useCallback(() => {
    if (onContinue) {
      onContinue();
    } else {
      router.replace("/dashboard");
    }
  }, [onContinue, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleContinue]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-background p-8 text-center"
      data-testid="onboarding-complete"
    >
      {/* Success icon */}
      <div className="w-20 h-20 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-2">Configuracao concluida!</h1>

      {/* Description */}
      <p className="text-muted-foreground mb-8 max-w-md">
        Agora o Virtus conhece melhor voce e pode oferecer uma experiencia personalizada.
      </p>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        className="px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
      >
        Comecar a usar o Virtus
      </button>

      {/* Auto-redirect countdown */}
      <p className="mt-4 text-xs text-muted-foreground">
        Redirecionando automaticamente em {countdown}s...
      </p>
    </div>
  );
}
