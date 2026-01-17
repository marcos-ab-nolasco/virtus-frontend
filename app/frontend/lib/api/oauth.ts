import { authenticatedClient } from "@/lib/api-client";
import type { components } from "@/types/api";

export type OAuthConnection = components["schemas"]["CalendarIntegrationResponse"];
type ValidationErrorDetail = components["schemas"]["HTTPValidationError"]["detail"] | undefined;

function extractErrorMessage(error: unknown, fallbackMessage: string): string {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "detail" in error) {
    const detail = (error as { detail?: unknown }).detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      const messages = (detail as ValidationErrorDetail)
        ?.map((item) => (item && typeof item.msg === "string" ? item.msg : null))
        .filter((msg): msg is string => Boolean(msg));

      if (messages && messages.length) {
        return messages.join(", ");
      }
    }
  }

  return fallbackMessage;
}

/**
 * Initiate Google OAuth flow
 * @returns Authorization URL to redirect user to
 */
export async function initiateGoogleOAuth(): Promise<string> {
  const response = await authenticatedClient.GET("/api/v1/auth/google");

  if (response.error) {
    throw new Error(extractErrorMessage(response.error, "Falha ao iniciar OAuth."));
  }

  if (!response.data?.authorization_url) {
    throw new Error("Falha ao iniciar OAuth.");
  }

  return response.data.authorization_url;
}

/**
 * Check OAuth connection status
 * @returns List of OAuth connections
 */
export async function checkOAuthStatus(): Promise<OAuthConnection[]> {
  const response = await authenticatedClient.GET("/api/v1/me/calendar/integrations");

  if (!response.data) {
    return [];
  }

  return response.data;
}

/**
 * Disconnect OAuth integration
 * @param provider Provider to disconnect (e.g., 'google')
 */
export async function disconnectOAuth(integrationId: string): Promise<void> {
  await authenticatedClient.DELETE("/api/v1/me/calendar/integrations/{integration_id}", {
    params: { path: { integration_id: integrationId } },
  });
}
