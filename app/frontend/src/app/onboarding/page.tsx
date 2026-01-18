"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { OnboardingPage } from "@/components/onboarding/OnboardingPage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Onboarding() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !isAuthenticated) {
      router.replace("/login?redirect=/onboarding");
    }
  }, [mounted, authLoading, isAuthenticated, router]);

  // Wait for client-side mount and auth check
  if (!mounted || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <OnboardingPage />;
}
