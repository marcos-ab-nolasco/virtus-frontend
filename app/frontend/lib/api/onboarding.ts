import { authenticatedClient } from "@/lib/api-client";
import type {
  OnboardingStartResponse,
  OnboardingMessageResponse,
  OnboardingStatusResponse,
  OnboardingSkipResponse,
} from "@/types/onboarding";

/**
 * Helper to format error messages from API responses
 */
function formatErrorMessage(error: unknown, fallback: string): string {
  if (!error) return fallback;

  if (Array.isArray(error)) {
    return error.map((e) => e.msg || "Unknown error").join(", ");
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null && "detail" in error) {
    const detail = (error as { detail: unknown }).detail;
    return formatErrorMessage(detail, fallback);
  }

  return fallback;
}

/**
 * Start onboarding session.
 * If already in progress, returns current state.
 */
export async function startOnboarding(): Promise<OnboardingStartResponse> {
  const response = await authenticatedClient.POST("/api/v1/onboarding/start");

  if (!response.data) {
    throw new Error("Failed to start onboarding");
  }

  return response.data;
}

/**
 * Send a message during onboarding flow.
 */
export async function sendOnboardingMessage(message: string): Promise<OnboardingMessageResponse> {
  const response = await authenticatedClient.POST("/api/v1/onboarding/message", {
    body: { message },
  });

  if (response.error) {
    throw new Error(formatErrorMessage(response.error.detail, "Failed to send onboarding message"));
  }

  return response.data;
}

/**
 * Get current onboarding status and progress.
 */
export async function getOnboardingStatus(): Promise<OnboardingStatusResponse> {
  const response = await authenticatedClient.GET("/api/v1/onboarding/status");

  if (!response.data) {
    throw new Error("Failed to get onboarding status");
  }

  return response.data;
}

/**
 * Skip onboarding and mark as completed.
 */
export async function skipOnboarding(): Promise<OnboardingSkipResponse> {
  const response = await authenticatedClient.PATCH("/api/v1/onboarding/skip");

  if (!response.data) {
    throw new Error("Failed to skip onboarding");
  }

  return response.data;
}
