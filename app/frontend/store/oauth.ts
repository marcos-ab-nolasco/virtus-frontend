import { create } from 'zustand';
import { initiateGoogleOAuth, checkOAuthStatus, disconnectOAuth, OAuthConnection } from '@/lib/api/oauth';

interface OAuthState {
  connections: OAuthConnection[];
  isLoading: boolean;
  error: string | null;
  initiateOAuth: (provider: 'google') => Promise<void>;
  fetchConnections: () => Promise<void>;
  disconnect: (provider: string) => Promise<void>;
  clearError: () => void;
}

export const useOAuthStore = create<OAuthState>((set) => ({
  connections: [],
  isLoading: false,
  error: null,

  initiateOAuth: async (provider: 'google') => {
    set({ isLoading: true, error: null });
    try {
      if (provider === 'google') {
        const authUrl = await initiateGoogleOAuth();
        // Redirect to authorization URL
        window.location.href = authUrl;
      } else {
        throw new Error(`Provider ${provider} not supported`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to initiate OAuth';
      set({ error: message, isLoading: false });
    }
  },

  fetchConnections: async () => {
    set({ isLoading: true, error: null });
    try {
      const connections = await checkOAuthStatus();
      set({ connections, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch connections';
      set({ error: message, isLoading: false });
    }
  },

  disconnect: async (provider: string) => {
    set({ isLoading: true, error: null });
    try {
      await disconnectOAuth(provider);
      // Refresh connections list
      const connections = await checkOAuthStatus();
      set({ connections, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to disconnect';
      set({ error: message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
