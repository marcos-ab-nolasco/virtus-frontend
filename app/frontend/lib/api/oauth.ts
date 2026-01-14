import { apiClient } from '@/lib/api-client';

export interface OAuthConnection {
  id: string;
  provider: string;
  connected: boolean;
  last_sync?: string;
}

/**
 * Initiate Google OAuth flow
 * @returns Authorization URL to redirect user to
 */
export async function initiateGoogleOAuth(): Promise<string> {
  const response = await apiClient.GET('/api/v1/auth/google');

  if (!response.data) {
    throw new Error('Failed to initiate OAuth');
  }

  return response.data.authorization_url;
}

/**
 * Check OAuth connection status
 * @returns List of OAuth connections
 */
export async function checkOAuthStatus(): Promise<OAuthConnection[]> {
  const response = await apiClient.GET('/api/v1/integrations');

  if (!response.data) {
    return [];
  }

  return response.data as OAuthConnection[];
}

/**
 * Disconnect OAuth integration
 * @param provider Provider to disconnect (e.g., 'google')
 */
export async function disconnectOAuth(provider: string): Promise<void> {
  await apiClient.DELETE('/api/v1/integrations/{provider}', {
    params: { path: { provider } },
  });
}
