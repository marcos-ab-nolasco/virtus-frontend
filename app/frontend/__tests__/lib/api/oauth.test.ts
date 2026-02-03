import { describe, it, expect, vi, beforeEach } from "vitest";
import { initiateGoogleOAuth, checkOAuthStatus, disconnectOAuth } from "@/lib/api/oauth";
import { authenticatedClient } from "@/lib/api-client";

type AuthenticatedGetResult = Awaited<ReturnType<typeof authenticatedClient.GET>>;
type AuthenticatedDeleteResult = Awaited<ReturnType<typeof authenticatedClient.DELETE>>;

vi.mock("@/lib/api-client", () => ({
  authenticatedClient: {
    GET: vi.fn(),
    DELETE: vi.fn(),
  },
}));

describe("OAuth API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initiateGoogleOAuth", () => {
    it("calls the correct endpoint and returns authorization URL", async () => {
      const mockResponse = {
        data: { authorization_url: "https://accounts.google.com/o/oauth2/auth?..." },
        response: {} as Response,
      } as unknown as AuthenticatedGetResult;

      vi.mocked(authenticatedClient.GET).mockResolvedValue(mockResponse);

      const url = await initiateGoogleOAuth();

      expect(url).toBe("https://accounts.google.com/o/oauth2/auth?...");
    });

    it("throws error when request fails", async () => {
      vi.mocked(authenticatedClient.GET).mockResolvedValue({
        error: "Network error",
        response: {} as Response,
      } as unknown as AuthenticatedGetResult);

      await expect(initiateGoogleOAuth()).rejects.toThrow("Network error");
    });
  });

  describe("checkOAuthStatus", () => {
    it("returns list of OAuth connections", async () => {
      const mockConnections = [
        {
          id: "1",
          user_id: "user-1",
          provider: "GOOGLE_CALENDAR",
          status: "ACTIVE",
          calendars_synced: null,
          sync_enabled: true,
          last_sync_at: "2026-01-13T10:00:00Z",
          sync_error: null,
          created_at: "2026-01-13T09:00:00Z",
          updated_at: "2026-01-13T09:30:00Z",
          token_expires_at: "2026-02-13T09:00:00Z",
          scopes: ["calendar.read"],
        },
      ];

      const mockResponse = {
        data: mockConnections,
        response: {} as Response,
      } as unknown as AuthenticatedGetResult;

      vi.mocked(authenticatedClient.GET).mockResolvedValue(mockResponse);

      const connections = await checkOAuthStatus();

      expect(connections).toEqual(mockConnections);
    });
  });

  describe("disconnectOAuth", () => {
    it("calls delete endpoint with provider", async () => {
      const mockDeleteResponse = {
        data: undefined,
        response: {} as Response,
      } as unknown as AuthenticatedDeleteResult;

      vi.mocked(authenticatedClient.DELETE).mockResolvedValue(mockDeleteResponse);

      await disconnectOAuth("integration-1");

      expect(authenticatedClient.DELETE).toHaveBeenCalledWith(
        "/api/v1/me/calendar/integrations/{integration_id}",
        {
          params: { path: { integration_id: "integration-1" } },
        }
      );
    });
  });
});
