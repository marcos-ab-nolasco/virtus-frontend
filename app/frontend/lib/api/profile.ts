import { authenticatedClient } from "@/lib/api-client";
import type { components } from "@/types/api";

type UserProfileResponse = components["schemas"]["UserProfileResponse"];
type UserPreferencesResponse = components["schemas"]["UserPreferencesResponse"];

export async function getMyProfile(): Promise<UserProfileResponse> {
  const response = await authenticatedClient.GET("/api/v1/me/profile");

  if (!response.data) {
    throw new Error("Falha ao carregar perfil.");
  }

  return response.data;
}

export async function getMyPreferences(): Promise<UserPreferencesResponse> {
  const response = await authenticatedClient.GET("/api/v1/me/preferences");

  if (!response.data) {
    throw new Error("Falha ao carregar preferencias.");
  }

  return response.data;
}
