"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function useOnboardingGuard() {
  const {
    isAuthenticated,
    isLoading,
    onboardingStatus,
    onboardingStatusError,
    isOnboardingLoading,
    refreshOnboardingStatus,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      !onboardingStatus &&
      !onboardingStatusError &&
      !isOnboardingLoading
    ) {
      refreshOnboardingStatus().catch((error) => {
        console.error("Failed to load onboarding status:", error);
      });
    }
  }, [
    isAuthenticated,
    isLoading,
    isOnboardingLoading,
    onboardingStatus,
    onboardingStatusError,
    refreshOnboardingStatus,
  ]);

  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      ((onboardingStatus && onboardingStatus !== "COMPLETED") || onboardingStatusError)
    ) {
      router.replace("/onboarding");
    }
  }, [isAuthenticated, isLoading, onboardingStatus, onboardingStatusError, router]);

  const isCheckingOnboarding =
    isLoading ||
    (isAuthenticated &&
      (isOnboardingLoading ||
        (!onboardingStatus && !onboardingStatusError) ||
        (onboardingStatus && onboardingStatus !== "COMPLETED") ||
        Boolean(onboardingStatusError)));

  return { isCheckingOnboarding, onboardingStatus };
}
