import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { OnboardingComplete } from "@/components/onboarding/OnboardingComplete";

const refreshUserMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    refreshUser: refreshUserMock,
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

describe("OnboardingComplete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("refreshes user on mount", () => {
    render(<OnboardingComplete />);

    expect(refreshUserMock).toHaveBeenCalled();
  });
});
