import { authenticatedClient, apiClient } from "@/lib/api-client";
import type { components } from "@/types/api";

export type OAuthConnection = components["schemas"]["CalendarIntegrationResponse"];

/**
 * Initiate Google OAuth flow
 * @returns Authorization URL to redirect user to
 */
export async function initiateGoogleOAuth(): Promise<string> {
  const response = await apiClient.GET("/api/v1/auth/google");

  if (!response.data) {
    throw new Error("Failed to initiate OAuth");
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
