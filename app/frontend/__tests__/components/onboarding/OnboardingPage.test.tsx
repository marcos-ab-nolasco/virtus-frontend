import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OnboardingPage } from "@/components/onboarding/OnboardingPage";
import * as onboardingApi from "@/lib/api/onboarding";

vi.mock("@/lib/api/onboarding");

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: replaceMock,
  }),
}));

describe("OnboardingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    vi.mocked(onboardingApi.getOnboardingStatus).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<OnboardingPage />);

    expect(screen.getByTestId("onboarding-loading")).toBeInTheDocument();
  });

  it("redirects to /home when status is COMPLETED", async () => {
    vi.mocked(onboardingApi.getOnboardingStatus).mockResolvedValue({
      status: "COMPLETED",
      current_step: null,
      progress_percent: 100,
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    });

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/home");
    });

    expect(onboardingApi.startOnboarding).not.toHaveBeenCalled();
  });

  it("calls startOnboarding when status is NOT_STARTED", async () => {
    vi.mocked(onboardingApi.getOnboardingStatus).mockResolvedValue({
      status: "NOT_STARTED",
      current_step: null,
      progress_percent: 0,
      started_at: null,
      completed_at: null,
    });

    vi.mocked(onboardingApi.startOnboarding).mockResolvedValue({
      status: "IN_PROGRESS",
      current_step: "welcome",
      message: "Bem-vindo ao Virtus!",
      started_at: new Date().toISOString(),
    });

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(onboardingApi.startOnboarding).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Bem-vindo ao Virtus!")).toBeInTheDocument();
    });
  });

  it("displays welcome message from startOnboarding response", async () => {
    vi.mocked(onboardingApi.getOnboardingStatus).mockResolvedValue({
      status: "NOT_STARTED",
      current_step: null,
      progress_percent: 0,
      started_at: null,
      completed_at: null,
    });

    vi.mocked(onboardingApi.startOnboarding).mockResolvedValue({
      status: "IN_PROGRESS",
      current_step: "welcome",
      message: "Ola! Sou o Virtus, seu assistente pessoal.",
      started_at: new Date().toISOString(),
    });

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(screen.getByText("Ola! Sou o Virtus, seu assistente pessoal.")).toBeInTheDocument();
    });
  });

  it("renders progress indicator", async () => {
    vi.mocked(onboardingApi.getOnboardingStatus).mockResolvedValue({
      status: "IN_PROGRESS",
      current_step: "vision",
      progress_percent: 40,
      started_at: new Date().toISOString(),
      completed_at: null,
    });

    vi.mocked(onboardingApi.startOnboarding).mockResolvedValue({
      status: "IN_PROGRESS",
      current_step: "vision",
      message: "Vamos comecar!",
      started_at: new Date().toISOString(),
    });

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  it("renders chat input", async () => {
    vi.mocked(onboardingApi.getOnboardingStatus).mockResolvedValue({
      status: "NOT_STARTED",
      current_step: null,
      progress_percent: 0,
      started_at: null,
      completed_at: null,
    });

    vi.mocked(onboardingApi.startOnboarding).mockResolvedValue({
      status: "IN_PROGRESS",
      current_step: "welcome",
      message: "Bem-vindo!",
      started_at: new Date().toISOString(),
    });

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Digite sua resposta/)).toBeInTheDocument();
    });
  });

  it("sends message when user types and submits", async () => {
    const user = userEvent.setup();

    vi.mocked(onboardingApi.getOnboardingStatus).mockResolvedValue({
      status: "NOT_STARTED",
      current_step: null,
      progress_percent: 0,
      started_at: null,
      completed_at: null,
    });

    vi.mocked(onboardingApi.startOnboarding).mockResolvedValue({
      status: "IN_PROGRESS",
      current_step: "welcome",
      message: "Qual e seu nome?",
      started_at: new Date().toISOString(),
    });

    vi.mocked(onboardingApi.sendOnboardingMessage).mockResolvedValue({
      current_step: "welcome",
      next_step: "vision",
      assistant_message: "Prazer em conhece-lo!",
      is_step_complete: true,
      validation_error: null,
    });

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Digite sua resposta/)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Digite sua resposta/);
    await user.type(input, "Joao");
    await user.click(screen.getByRole("button", { name: /Enviar/i }));

    await waitFor(() => {
      expect(onboardingApi.sendOnboardingMessage).toHaveBeenCalledWith("Joao");
    });
  });

  it("shows typing indicator while waiting for response", async () => {
    const user = userEvent.setup();

    vi.mocked(onboardingApi.getOnboardingStatus).mockResolvedValue({
      status: "NOT_STARTED",
      current_step: null,
      progress_percent: 0,
      started_at: null,
      completed_at: null,
    });

    vi.mocked(onboardingApi.startOnboarding).mockResolvedValue({
      status: "IN_PROGRESS",
      current_step: "welcome",
      message: "Ola!",
      started_at: new Date().toISOString(),
    });

    vi.mocked(onboardingApi.sendOnboardingMessage).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                current_step: "welcome",
                next_step: "vision",
                assistant_message: "Entendi!",
                is_step_complete: true,
                validation_error: null,
              }),
            1000
          )
        )
    );

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Digite sua resposta/)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Digite sua resposta/);
    await user.type(input, "Test");
    await user.click(screen.getByRole("button", { name: /Enviar/i }));

    await waitFor(() => {
      expect(screen.getByTestId("typing-indicator")).toBeInTheDocument();
    });
  });

  it("displays error message on API failure", async () => {
    vi.mocked(onboardingApi.getOnboardingStatus).mockRejectedValue(new Error("Network error"));

    render(<OnboardingPage />);

    await waitFor(() => {
      expect(screen.getByText(/Erro ao carregar onboarding/)).toBeInTheDocument();
    });
  });
});
