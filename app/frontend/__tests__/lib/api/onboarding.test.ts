/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as onboardingApi from "@/lib/api/onboarding";
import { authenticatedClient } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  authenticatedClient: {
    GET: vi.fn(),
    POST: vi.fn(),
    PATCH: vi.fn(),
  },
  apiClient: {
    POST: vi.fn(),
  },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
  setRefreshTokenCallback: vi.fn(),
}));

describe("Onboarding API Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("startOnboarding", () => {
    it("should call POST /api/v1/onboarding/start", async () => {
      const mockResponse = {
        status: "IN_PROGRESS",
        current_step: "welcome",
        message: "Bem-vindo ao Virtus!",
        started_at: new Date().toISOString(),
      };

      vi.mocked(authenticatedClient.POST).mockResolvedValueOnce({
        data: mockResponse,
        error: undefined,
      } as any);

      const result = await onboardingApi.startOnboarding();

      expect(authenticatedClient.POST).toHaveBeenCalledWith("/api/v1/onboarding/start");
      expect(result).toEqual(mockResponse);
    });

    it("should return existing session if already in progress", async () => {
      const mockResponse = {
        status: "IN_PROGRESS",
        current_step: "vision",
        message: "Continuando de onde paramos...",
        started_at: new Date().toISOString(),
      };

      vi.mocked(authenticatedClient.POST).mockResolvedValueOnce({
        data: mockResponse,
        error: undefined,
      } as any);

      const result = await onboardingApi.startOnboarding();

      expect(result.current_step).toBe("vision");
    });

    it("should throw error on failure", async () => {
      vi.mocked(authenticatedClient.POST).mockResolvedValueOnce({
        data: undefined,
        error: { detail: "User not found" },
      } as any);

      await expect(onboardingApi.startOnboarding()).rejects.toThrow();
    });
  });

  describe("sendOnboardingMessage", () => {
    it("should call POST /api/v1/onboarding/message with message body", async () => {
      const mockResponse = {
        current_step: "vision",
        next_step: "obstacles",
        assistant_message: "Obrigado por compartilhar!",
        is_step_complete: true,
        validation_error: null,
      };

      vi.mocked(authenticatedClient.POST).mockResolvedValueOnce({
        data: mockResponse,
        error: undefined,
      } as any);

      const result = await onboardingApi.sendOnboardingMessage("Minha visao para 5 anos");

      expect(authenticatedClient.POST).toHaveBeenCalledWith("/api/v1/onboarding/message", {
        body: { message: "Minha visao para 5 anos" },
      });
      expect(result).toEqual(mockResponse);
    });

    it("should return validation error if message is invalid", async () => {
      const mockResponse = {
        current_step: "vision",
        next_step: null,
        assistant_message: "Por favor, descreva sua visao com mais detalhes.",
        is_step_complete: false,
        validation_error: "Resposta muito curta",
      };

      vi.mocked(authenticatedClient.POST).mockResolvedValueOnce({
        data: mockResponse,
        error: undefined,
      } as any);

      const result = await onboardingApi.sendOnboardingMessage("ok");

      expect(result.validation_error).toBe("Resposta muito curta");
      expect(result.is_step_complete).toBe(false);
    });

    it("should throw error on network failure", async () => {
      vi.mocked(authenticatedClient.POST).mockResolvedValueOnce({
        data: undefined,
        error: { detail: "Network error" },
      } as any);

      await expect(onboardingApi.sendOnboardingMessage("test")).rejects.toThrow();
    });
  });

  describe("getOnboardingStatus", () => {
    it("should call GET /api/v1/onboarding/status", async () => {
      const mockResponse = {
        status: "IN_PROGRESS",
        current_step: "obstacles",
        progress_percent: 40,
        started_at: new Date().toISOString(),
        completed_at: null,
      };

      vi.mocked(authenticatedClient.GET).mockResolvedValueOnce({
        data: mockResponse,
        error: undefined,
      } as any);

      const result = await onboardingApi.getOnboardingStatus();

      expect(authenticatedClient.GET).toHaveBeenCalledWith("/api/v1/onboarding/status");
      expect(result).toEqual(mockResponse);
    });

    it("should return NOT_STARTED for new users", async () => {
      const mockResponse = {
        status: "NOT_STARTED",
        current_step: null,
        progress_percent: 0,
        started_at: null,
        completed_at: null,
      };

      vi.mocked(authenticatedClient.GET).mockResolvedValueOnce({
        data: mockResponse,
        error: undefined,
      } as any);

      const result = await onboardingApi.getOnboardingStatus();

      expect(result.status).toBe("NOT_STARTED");
      expect(result.progress_percent).toBe(0);
    });

    it("should return COMPLETED with completed_at date", async () => {
      const completedAt = new Date().toISOString();
      const mockResponse = {
        status: "COMPLETED",
        current_step: null,
        progress_percent: 100,
        started_at: new Date().toISOString(),
        completed_at: completedAt,
      };

      vi.mocked(authenticatedClient.GET).mockResolvedValueOnce({
        data: mockResponse,
        error: undefined,
      } as any);

      const result = await onboardingApi.getOnboardingStatus();

      expect(result.status).toBe("COMPLETED");
      expect(result.completed_at).toBe(completedAt);
    });

    it("should throw error on failure", async () => {
      vi.mocked(authenticatedClient.GET).mockResolvedValueOnce({
        data: undefined,
        error: { detail: "Unauthorized" },
      } as any);

      await expect(onboardingApi.getOnboardingStatus()).rejects.toThrow();
    });
  });

  describe("skipOnboarding", () => {
    it("should call PATCH /api/v1/onboarding/skip", async () => {
      const mockResponse = {
        status: "COMPLETED",
        completed_at: new Date().toISOString(),
      };

      vi.mocked(authenticatedClient.PATCH).mockResolvedValueOnce({
        data: mockResponse,
        error: undefined,
      } as any);

      const result = await onboardingApi.skipOnboarding();

      expect(authenticatedClient.PATCH).toHaveBeenCalledWith("/api/v1/onboarding/skip");
      expect(result.status).toBe("COMPLETED");
    });

    it("should throw error if skip fails", async () => {
      vi.mocked(authenticatedClient.PATCH).mockResolvedValueOnce({
        data: undefined,
        error: { detail: "Cannot skip completed onboarding" },
      } as any);

      await expect(onboardingApi.skipOnboarding()).rejects.toThrow();
    });
  });

  describe("Authentication Guard", () => {
    it("ALL onboarding functions require authentication", async () => {
      const unauthorizedError = { detail: "Not authenticated" };

      vi.mocked(authenticatedClient.GET).mockResolvedValue({
        data: undefined,
        error: unauthorizedError,
      } as any);

      vi.mocked(authenticatedClient.POST).mockResolvedValue({
        data: undefined,
        error: unauthorizedError,
      } as any);

      vi.mocked(authenticatedClient.PATCH).mockResolvedValue({
        data: undefined,
        error: unauthorizedError,
      } as any);

      await expect(onboardingApi.startOnboarding()).rejects.toThrow();
      await expect(onboardingApi.sendOnboardingMessage("test")).rejects.toThrow();
      await expect(onboardingApi.getOnboardingStatus()).rejects.toThrow();
      await expect(onboardingApi.skipOnboarding()).rejects.toThrow();
    });
  });
});
