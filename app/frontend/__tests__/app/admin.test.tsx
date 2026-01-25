import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminPage from "@/src/app/admin/page";
import * as adminApi from "@/lib/api/admin";

const pushMock = vi.fn();

const timestamp = new Date().toISOString();

let authState = {
  user: {
    id: "admin-1",
    email: "admin@example.com",
    full_name: "Admin User",
    is_admin: true,
    is_blocked: false,
    created_at: timestamp,
    updated_at: timestamp,
  },
  isAuthenticated: true,
  isLoading: false,
  onboardingStatus: "COMPLETED",
  onboardingStatusError: null,
  isOnboardingLoading: false,
  refreshOnboardingStatus: vi.fn().mockResolvedValue("COMPLETED"),
  logout: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: pushMock }),
  usePathname: () => "/admin",
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => authState,
}));

vi.mock("@/lib/api/admin");

describe("AdminPage", () => {
  const adminUser = {
    id: "admin-1",
    email: "admin@example.com",
    full_name: "Admin User",
    is_admin: true,
    is_blocked: false,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const otherUser = {
    id: "user-2",
    email: "user@example.com",
    full_name: "Regular User",
    is_admin: false,
    is_blocked: false,
    created_at: timestamp,
    updated_at: timestamp,
  };

  beforeEach(() => {
    pushMock.mockClear();
    authState = {
      user: adminUser,
      isAuthenticated: true,
      isLoading: false,
      onboardingStatus: "COMPLETED",
      onboardingStatusError: null,
      isOnboardingLoading: false,
      refreshOnboardingStatus: vi.fn().mockResolvedValue("COMPLETED"),
      logout: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it("renders and allows blocking/unblocking another user", async () => {
    vi.mocked(adminApi.listUsers)
      .mockResolvedValueOnce({
        users: [adminUser, otherUser],
        total: 2,
        limit: 10,
        offset: 0,
      })
      .mockResolvedValueOnce({
        users: [adminUser, { ...otherUser, is_blocked: true }],
        total: 2,
        limit: 10,
        offset: 0,
      })
      .mockResolvedValueOnce({
        users: [adminUser, otherUser],
        total: 2,
        limit: 10,
        offset: 0,
      });

    vi.mocked(adminApi.blockUser).mockResolvedValue({ ...otherUser, is_blocked: true });
    vi.mocked(adminApi.unblockUser).mockResolvedValue({ ...otherUser, is_blocked: false });

    render(<AdminPage />);

    await screen.findByText(/administração de usuários/i);

    const user = userEvent.setup();
    const userRow = screen.getByText(otherUser.email).closest("tr");
    expect(userRow).not.toBeNull();
    if (!userRow) return;

    const userActions = within(userRow);
    const blockButton = userActions.getByRole("button", { name: /bloquear/i });

    await user.click(blockButton);

    await waitFor(() => {
      expect(adminApi.blockUser).toHaveBeenCalledWith(otherUser.id);
    });

    await waitFor(() => {
      expect(userActions.getByRole("button", { name: /desbloquear/i })).toBeInTheDocument();
    });

    const unblockButton = userActions.getByRole("button", { name: /desbloquear/i });
    await user.click(unblockButton);

    await waitFor(() => {
      expect(adminApi.unblockUser).toHaveBeenCalledWith(otherUser.id);
    });
  });

  it("disables actions for the current admin user", async () => {
    vi.mocked(adminApi.listUsers).mockResolvedValue({
      users: [adminUser, otherUser],
      total: 2,
      limit: 10,
      offset: 0,
    });

    render(<AdminPage />);

    const table = await screen.findByRole("table");
    const adminCell = within(table).getByRole("cell", { name: adminUser.email });
    const rowElement = adminCell.closest("tr");
    expect(rowElement).not.toBeNull();
    if (!rowElement) return;

    const rowActions = within(rowElement);
    expect(rowActions.getByRole("button", { name: /^onboarding$/i })).toBeEnabled();
    expect(rowActions.getByRole("button", { name: /resetar onboarding/i })).toBeEnabled();
    expect(rowActions.getByRole("button", { name: /bloquear/i })).toBeDisabled();
    expect(rowActions.getByRole("button", { name: /remover/i })).toBeDisabled();
  });

  it("redirects non-admin users", async () => {
    authState = {
      user: {
        id: "user-3",
        email: "user3@example.com",
        full_name: "User",
        is_admin: false,
        is_blocked: false,
        created_at: timestamp,
        updated_at: timestamp,
      },
      isAuthenticated: true,
      isLoading: false,
      onboardingStatus: "COMPLETED",
      onboardingStatusError: null,
      isOnboardingLoading: false,
      refreshOnboardingStatus: vi.fn().mockResolvedValue("COMPLETED"),
      logout: vi.fn(),
    };

    render(<AdminPage />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("loads onboarding details when requested", async () => {
    vi.mocked(adminApi.listUsers).mockResolvedValue({
      users: [adminUser, otherUser],
      total: 2,
      limit: 10,
      offset: 0,
    });

    vi.mocked(adminApi.getUserOnboarding).mockResolvedValue({
      user_id: otherUser.id,
      profile: {
        id: "profile-1",
        user_id: otherUser.id,
        onboarding_status: "IN_PROGRESS",
        onboarding_started_at: null,
        onboarding_completed_at: null,
        onboarding_current_step: "name",
        onboarding_data: { name: "Maria" },
        vision_5_years: null,
        vision_5_years_themes: null,
        main_obstacle: null,
        annual_objectives: null,
        observed_patterns: null,
        moral_profile: null,
        strengths: null,
        interests: null,
        energy_activities: null,
        drain_activities: null,
        satisfaction_health: null,
        satisfaction_work: null,
        satisfaction_relationships: null,
        satisfaction_personal_time: null,
        dashboard_updated_at: null,
        created_at: timestamp,
        updated_at: timestamp,
      },
      preferences: {
        id: "pref-1",
        user_id: otherUser.id,
        timezone: "UTC",
        morning_checkin_enabled: true,
        morning_checkin_time: "08:00:00",
        evening_checkin_enabled: true,
        evening_checkin_time: "21:00:00",
        weekly_review_day: "SUNDAY",
        communication_style: "DIRECT",
        coach_name: "Virtus",
        created_at: timestamp,
        updated_at: timestamp,
      },
    });

    render(<AdminPage />);

    await screen.findByText(/administração de usuários/i);

    const user = userEvent.setup();
    const userRow = screen.getByText(otherUser.email).closest("tr");
    expect(userRow).not.toBeNull();
    if (!userRow) return;

    const rowActions = within(userRow);
    const onboardingButton = rowActions.getByRole("button", { name: /^onboarding$/i });

    await user.click(onboardingButton);

    await waitFor(() => {
      expect(adminApi.getUserOnboarding).toHaveBeenCalledWith(otherUser.id);
    });

    expect(await screen.findByText(/dados de onboarding/i)).toBeInTheDocument();
  });
});
