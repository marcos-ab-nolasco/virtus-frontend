import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { components } from "@/types/api";
import * as authApi from "@/lib/api/auth";
import * as onboardingApi from "@/lib/api/onboarding";
import { setAuthToken, clearAuthToken, setRefreshTokenCallback } from "@/lib/api-client";
import type { OnboardingStatus } from "@/types/onboarding";

type UserRead = components["schemas"]["UserRead"];

interface AuthState {
  // State
  user: UserRead | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  onboardingStatus: OnboardingStatus | null;
  onboardingStatusError: string | null;
  isOnboardingLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
  initializeSession: () => Promise<void>;
  refreshOnboardingStatus: () => Promise<OnboardingStatus | null>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      onboardingStatus: null,
      onboardingStatusError: null,
      isOnboardingLoading: false,

      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const tokens = await authApi.login({ email, password });
          const user = await authApi.getCurrentUser();

          set({
            user,
            accessToken: tokens.access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          setRefreshTokenCallback(async () => {
            await get().refreshAuth();
          });

          await get().refreshOnboardingStatus();
        } catch (error) {
          const message = error instanceof Error ? error.message : "Login failed";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Register action
      register: async (email: string, password: string, fullName: string) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.register({ email, password, full_name: fullName });
          // After registration, automatically log in
          await get().login(email, password);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Registration failed";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          clearAuthToken();
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            error: null,
            onboardingStatus: null,
            onboardingStatusError: null,
            isOnboardingLoading: false,
          });
        }
      },

      // Refresh token action
      refreshAuth: async () => {
        try {
          const tokens = await authApi.refreshToken();
          set({
            accessToken: tokens.access_token,
            isAuthenticated: true,
          });

          setRefreshTokenCallback(async () => {
            await get().refreshAuth();
          });
        } catch (error) {
          // If refresh fails, logout
          await get().logout();
          throw error;
        }
      },

      refreshUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
          await get().refreshOnboardingStatus();
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to refresh user";
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      initializeSession: async () => {
        try {
          const tokens = await authApi.refreshToken();
          set({ accessToken: tokens.access_token, isAuthenticated: true });
          const user = await authApi.getCurrentUser();
          set({ user, isAuthenticated: true });
          setRefreshTokenCallback(async () => {
            await get().refreshAuth();
          });
          await get().refreshOnboardingStatus();
        } catch {
          // Session not available; ensure clean state
          clearAuthToken();
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            onboardingStatus: null,
            onboardingStatusError: null,
            isOnboardingLoading: false,
          });
        }
      },

      refreshOnboardingStatus: async () => {
        set({ isOnboardingLoading: true, onboardingStatusError: null });
        try {
          const response = await onboardingApi.getOnboardingStatus();
          const status = response.status as OnboardingStatus;
          set({ onboardingStatus: status, isOnboardingLoading: false });
          return status;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to load onboarding status";
          set({ onboardingStatusError: message, isOnboardingLoading: false });
          return null;
        }
      },

      // Clear error action
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        const accessToken = state?.accessToken;
        if (accessToken) {
          setAuthToken(accessToken);
          setRefreshTokenCallback(async () => {
            await useAuthStore.getState().refreshAuth();
          });
        } else {
          void useAuthStore.getState().initializeSession();
        }
      },
    }
  )
);
