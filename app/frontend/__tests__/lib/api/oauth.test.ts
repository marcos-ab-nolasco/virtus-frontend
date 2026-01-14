import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initiateGoogleOAuth, checkOAuthStatus, disconnectOAuth } from '@/lib/api/oauth';
import * as apiClient from '@/lib/api-client';

vi.mock('@/lib/api-client');

describe('OAuth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initiateGoogleOAuth', () => {
    it('calls the correct endpoint and returns authorization URL', async () => {
      const mockResponse = {
        data: { authorization_url: 'https://accounts.google.com/o/oauth2/auth?...' },
        response: {} as Response,
      };

      vi.spyOn(apiClient, 'apiClient').mockReturnValue({
        GET: vi.fn().mockResolvedValue(mockResponse),
      } as any);

      const url = await initiateGoogleOAuth();

      expect(url).toBe('https://accounts.google.com/o/oauth2/auth?...');
    });

    it('throws error when request fails', async () => {
      vi.spyOn(apiClient, 'apiClient').mockReturnValue({
        GET: vi.fn().mockRejectedValue(new Error('Network error')),
      } as any);

      await expect(initiateGoogleOAuth()).rejects.toThrow('Network error');
    });
  });

  describe('checkOAuthStatus', () => {
    it('returns list of OAuth connections', async () => {
      const mockConnections = [
        {
          id: '1',
          provider: 'GOOGLE',
          connected: true,
          last_sync: '2026-01-13T10:00:00Z',
        },
      ];

      const mockResponse = {
        data: mockConnections,
        response: {} as Response,
      };

      vi.spyOn(apiClient, 'apiClient').mockReturnValue({
        GET: vi.fn().mockResolvedValue(mockResponse),
      } as any);

      const connections = await checkOAuthStatus();

      expect(connections).toEqual(mockConnections);
    });
  });

  describe('disconnectOAuth', () => {
    it('calls delete endpoint with provider', async () => {
      const mockDelete = vi.fn().mockResolvedValue({ data: undefined, response: {} as Response });

      vi.spyOn(apiClient, 'apiClient').mockReturnValue({
        DELETE: mockDelete,
      } as any);

      await disconnectOAuth('google');

      expect(mockDelete).toHaveBeenCalledWith('/api/v1/integrations/{provider}', {
        params: { path: { provider: 'google' } },
      });
    });
  });
});
