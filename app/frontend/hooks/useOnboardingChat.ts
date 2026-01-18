import { useState, useCallback } from "react";
import * as onboardingApi from "@/lib/api/onboarding";
import type {
  OnboardingMessage,
  OnboardingStatus,
  OnboardingStatusResponse,
} from "@/types/onboarding";

interface UseOnboardingChatReturn {
  // State
  messages: OnboardingMessage[];
  status: OnboardingStatus;
  currentStep: string | null;
  progressPercent: number;
  isLoading: boolean;
  isSending: boolean;
  isTyping: boolean;
  error: string | null;
  validationError: string | null;

  // Actions
  startOnboarding: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  sendQuickReply: (label: string, value: string) => Promise<void>;
  getStatus: () => Promise<OnboardingStatusResponse>;
  skipOnboarding: () => Promise<void>;
  clearError: () => void;
}

export function useOnboardingChat(): UseOnboardingChatReturn {
  const [messages, setMessages] = useState<OnboardingMessage[]>([]);
  const [status, setStatus] = useState<OnboardingStatus>("NOT_STARTED");
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (shouldThrow: boolean): Promise<OnboardingStatusResponse | null> => {
      try {
        const response = await onboardingApi.getOnboardingStatus();

        setStatus(response.status as OnboardingStatus);
        setCurrentStep(response.current_step ?? null);
        setProgressPercent(response.progress_percent);

        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to get status";
        setError(message);
        if (shouldThrow) {
          throw err;
        }
        return null;
      }
    },
    []
  );

  const startOnboarding = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await onboardingApi.startOnboarding();

      const welcomeMessage: OnboardingMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.message,
        timestamp: response.started_at,
      };

      setMessages([welcomeMessage]);
      setStatus(response.status as OnboardingStatus);
      setCurrentStep(response.current_step);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start onboarding";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      setIsSending(true);
      setIsTyping(true);
      setError(null);
      setValidationError(null);

      // Add user message immediately
      const userMessage: OnboardingMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await onboardingApi.sendOnboardingMessage(content);

        // Add assistant response
        const assistantMessage: OnboardingMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.assistant_message,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (response.next_step) {
          setCurrentStep(response.next_step);
        }

        if (response.validation_error) {
          setValidationError(response.validation_error);
        }

        await updateStatus(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to send message";
        setError(message);
      } finally {
        setIsSending(false);
        setIsTyping(false);
      }
    },
    [updateStatus]
  );

  const sendQuickReply = useCallback(
    async (label: string, value: string) => {
      setIsSending(true);
      setIsTyping(true);
      setError(null);
      setValidationError(null);

      // Add user message with label (what user sees)
      const userMessage: OnboardingMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: label,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        // Send value to API
        const response = await onboardingApi.sendOnboardingMessage(value);

        const assistantMessage: OnboardingMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.assistant_message,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (response.next_step) {
          setCurrentStep(response.next_step);
        }

        if (response.validation_error) {
          setValidationError(response.validation_error);
        }

        await updateStatus(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to send message";
        setError(message);
      } finally {
        setIsSending(false);
        setIsTyping(false);
      }
    },
    [updateStatus]
  );

  const getStatus = useCallback(async () => {
    const response = await updateStatus(true);
    if (!response) {
      throw new Error("Failed to get status");
    }
    return response;
  }, [updateStatus]);

  const skipOnboarding = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await onboardingApi.skipOnboarding();
      setStatus(response.status as OnboardingStatus);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to skip onboarding";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setValidationError(null);
  }, []);

  return {
    messages,
    status,
    currentStep,
    progressPercent,
    isLoading,
    isSending,
    isTyping,
    error,
    validationError,
    startOnboarding,
    sendMessage,
    sendQuickReply,
    getStatus,
    skipOnboarding,
    clearError,
  };
}
