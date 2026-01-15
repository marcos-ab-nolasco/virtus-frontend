import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOnboardingChat } from "@/hooks/useOnboardingChat";
import * as onboardingApi from "@/lib/api/onboarding";

vi.mock("@/lib/api/onboarding");

describe("useOnboardingChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initialization", () => {
    it("should start with empty messages and loading state", () => {
      const { result } = renderHook(() => useOnboardingChat());

      expect(result.current.messages).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSending).toBe(false);
      expect(result.current.isTyping).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe("startOnboarding", () => {
    it("should call API and add welcome message", async () => {
      const mockResponse = {
        status: "IN_PROGRESS",
        current_step: "welcome",
        message: "Bem-vindo ao Virtus!",
        started_at: new Date().toISOString(),
      };

      vi.mocked(onboardingApi.startOnboarding).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useOnboardingChat());

      await act(async () => {
        await result.current.startOnboarding();
      });

      expect(onboardingApi.startOnboarding).toHaveBeenCalled();
      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].role).toBe("assistant");
      expect(result.current.messages[0].content).toBe("Bem-vindo ao Virtus!");
      expect(result.current.currentStep).toBe("welcome");
      expect(result.current.status).toBe("IN_PROGRESS");
    });

    it("should set loading state during API call", async () => {
      vi.mocked(onboardingApi.startOnboarding).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  status: "IN_PROGRESS",
                  current_step: "welcome",
                  message: "Bem-vindo!",
                  started_at: new Date().toISOString(),
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useOnboardingChat());

      act(() => {
        result.current.startOnboarding();
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        vi.advanceTimersByTime(100);
        await vi.runAllTimersAsync();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it("should handle errors gracefully", async () => {
      vi.mocked(onboardingApi.startOnboarding).mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useOnboardingChat());

      await act(async () => {
        await result.current.startOnboarding();
      });

      expect(result.current.error).toBe("Network error");
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("sendMessage", () => {
    it("should send user message and receive assistant response", async () => {
      const mockStartResponse = {
        status: "IN_PROGRESS",
        current_step: "welcome",
        message: "Bem-vindo!",
        started_at: new Date().toISOString(),
      };

      const mockMessageResponse = {
        current_step: "welcome",
        next_step: "vision",
        assistant_message: "Obrigado por compartilhar!",
        is_step_complete: true,
        validation_error: null,
      };

      vi.mocked(onboardingApi.startOnboarding).mockResolvedValueOnce(mockStartResponse);
      vi.mocked(onboardingApi.sendOnboardingMessage).mockResolvedValueOnce(mockMessageResponse);

      const { result } = renderHook(() => useOnboardingChat());

      await act(async () => {
        await result.current.startOnboarding();
      });

      await act(async () => {
        await result.current.sendMessage("Minha resposta");
      });

      expect(onboardingApi.sendOnboardingMessage).toHaveBeenCalledWith("Minha resposta");
      expect(result.current.messages).toHaveLength(3); // welcome + user + assistant
      expect(result.current.messages[1].role).toBe("user");
      expect(result.current.messages[1].content).toBe("Minha resposta");
      expect(result.current.messages[2].role).toBe("assistant");
      expect(result.current.messages[2].content).toBe("Obrigado por compartilhar!");
    });

    it("should set typing state while waiting for response", async () => {
      vi.mocked(onboardingApi.sendOnboardingMessage).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  current_step: "welcome",
                  next_step: "vision",
                  assistant_message: "Resposta",
                  is_step_complete: true,
                  validation_error: null,
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useOnboardingChat());

      act(() => {
        result.current.sendMessage("Test");
      });

      expect(result.current.isSending).toBe(true);
      expect(result.current.isTyping).toBe(true);

      await act(async () => {
        vi.advanceTimersByTime(100);
        await vi.runAllTimersAsync();
      });

      expect(result.current.isSending).toBe(false);
      expect(result.current.isTyping).toBe(false);
    });

    it("should handle validation errors", async () => {
      const mockMessageResponse = {
        current_step: "vision",
        next_step: null,
        assistant_message: "Por favor, elabore mais.",
        is_step_complete: false,
        validation_error: "Resposta muito curta",
      };

      vi.mocked(onboardingApi.sendOnboardingMessage).mockResolvedValueOnce(mockMessageResponse);

      const { result } = renderHook(() => useOnboardingChat());

      await act(async () => {
        await result.current.sendMessage("ok");
      });

      expect(result.current.messages).toHaveLength(2); // user + assistant
      expect(result.current.validationError).toBe("Resposta muito curta");
    });

    it("should handle network errors", async () => {
      vi.mocked(onboardingApi.sendOnboardingMessage).mockRejectedValueOnce(
        new Error("Network error")
      );

      const { result } = renderHook(() => useOnboardingChat());

      await act(async () => {
        await result.current.sendMessage("Test");
      });

      expect(result.current.error).toBe("Network error");
    });
  });

  describe("sendQuickReply", () => {
    it("should send quick reply as a regular message", async () => {
      const mockMessageResponse = {
        current_step: "welcome",
        next_step: "vision",
        assistant_message: "Obrigado!",
        is_step_complete: true,
        validation_error: null,
      };

      vi.mocked(onboardingApi.sendOnboardingMessage).mockResolvedValueOnce(mockMessageResponse);

      const { result } = renderHook(() => useOnboardingChat());

      await act(async () => {
        await result.current.sendQuickReply("Opcao A", "opcao_a");
      });

      expect(onboardingApi.sendOnboardingMessage).toHaveBeenCalledWith("opcao_a");
      expect(result.current.messages[0].content).toBe("Opcao A");
    });
  });

  describe("getStatus", () => {
    it("should fetch and update status", async () => {
      const mockStatus = {
        status: "IN_PROGRESS",
        current_step: "vision",
        progress_percent: 40,
        started_at: new Date().toISOString(),
        completed_at: null,
      };

      vi.mocked(onboardingApi.getOnboardingStatus).mockResolvedValueOnce(mockStatus);

      const { result } = renderHook(() => useOnboardingChat());

      await act(async () => {
        await result.current.getStatus();
      });

      expect(onboardingApi.getOnboardingStatus).toHaveBeenCalled();
      expect(result.current.progressPercent).toBe(40);
      expect(result.current.currentStep).toBe("vision");
    });

    it("should detect completed status", async () => {
      const mockStatus = {
        status: "COMPLETED",
        current_step: null,
        progress_percent: 100,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      };

      vi.mocked(onboardingApi.getOnboardingStatus).mockResolvedValueOnce(mockStatus);

      const { result } = renderHook(() => useOnboardingChat());

      await act(async () => {
        await result.current.getStatus();
      });

      expect(result.current.status).toBe("COMPLETED");
      expect(result.current.progressPercent).toBe(100);
    });
  });

  describe("skipOnboarding", () => {
    it("should call skip API and update status", async () => {
      const mockResponse = {
        status: "COMPLETED",
        completed_at: new Date().toISOString(),
      };

      vi.mocked(onboardingApi.skipOnboarding).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useOnboardingChat());

      await act(async () => {
        await result.current.skipOnboarding();
      });

      expect(onboardingApi.skipOnboarding).toHaveBeenCalled();
      expect(result.current.status).toBe("COMPLETED");
    });
  });

  describe("clearError", () => {
    it("should clear error and validation error", async () => {
      vi.mocked(onboardingApi.startOnboarding).mockRejectedValueOnce(new Error("Test error"));

      const { result } = renderHook(() => useOnboardingChat());

      await act(async () => {
        await result.current.startOnboarding();
      });

      expect(result.current.error).toBe("Test error");

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
      expect(result.current.validationError).toBe(null);
    });
  });
});
