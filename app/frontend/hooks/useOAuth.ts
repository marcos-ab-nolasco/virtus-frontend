import { useOAuthStore } from "@/store/oauth";

export function useOAuth() {
  return useOAuthStore();
}
