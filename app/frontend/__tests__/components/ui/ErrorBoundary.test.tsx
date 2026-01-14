import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import userEvent from "@testing-library/user-event";

// Component that throws an error
const ThrowError = ({ message = "Test error" }: { message?: string }) => {
  throw new Error(message);
};

// Component that renders normally
const NormalComponent = () => <div>Normal content</div>;

describe("ErrorBoundary", () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Normal content")).toBeInTheDocument();
  });

  it("catches errors and displays fallback UI", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Algo deu errado")).toBeInTheDocument();
    expect(
      screen.getByText("Ocorreu um erro inesperado. Por favor, tente novamente.")
    ).toBeInTheDocument();
  });

  it("displays error details in development mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    render(
      <ErrorBoundary>
        <ThrowError message="Custom error message" />
      </ErrorBoundary>
    );

    // In development/test mode, error details should be visible
    expect(screen.getByText("Detalhes do erro (apenas em desenvolvimento)")).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it("shows action buttons", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Tentar novamente")).toBeInTheDocument();
    expect(screen.getByText("Ir para início")).toBeInTheDocument();
  });

  it("has reset button that calls handleReset", async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Algo deu errado")).toBeInTheDocument();

    // Verify reset button exists and is clickable
    const resetButton = screen.getByText("Tentar novamente");
    expect(resetButton).toBeInTheDocument();

    // Click should not throw error
    await user.click(resetButton);

    // Button should still be there (error will persist until children succeed)
    expect(screen.getByText("Tentar novamente")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error message")).toBeInTheDocument();
    expect(screen.queryByText("Algo deu errado")).not.toBeInTheDocument();
  });
});
