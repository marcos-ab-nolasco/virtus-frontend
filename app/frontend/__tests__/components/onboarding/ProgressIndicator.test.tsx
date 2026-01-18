import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressIndicator } from "@/components/onboarding/ProgressIndicator";

describe("ProgressIndicator", () => {
  it("renders progress bar with correct percentage", () => {
    render(<ProgressIndicator progressPercent={40} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("aria-valuenow", "40");
  });

  it("shows 0% progress at start", () => {
    render(<ProgressIndicator progressPercent={0} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "0");
  });

  it("shows 100% progress when complete", () => {
    render(<ProgressIndicator progressPercent={100} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "100");
  });

  it("displays current step text when provided", () => {
    render(<ProgressIndicator progressPercent={60} currentStep="Seus objetivos" />);

    expect(screen.getByText("Seus objetivos")).toBeInTheDocument();
  });

  it("shows step counter when steps are provided", () => {
    render(<ProgressIndicator progressPercent={40} currentStepNumber={2} totalSteps={5} />);

    expect(screen.getByText("Passo 2 de 5")).toBeInTheDocument();
  });

  it("applies compact style when compact prop is true", () => {
    render(<ProgressIndicator progressPercent={50} compact />);

    const container = screen.getByTestId("progress-indicator");
    expect(container).toHaveClass("h-1");
  });

  it("applies default height when compact is false", () => {
    render(<ProgressIndicator progressPercent={50} />);

    const container = screen.getByTestId("progress-indicator");
    expect(container).toHaveClass("h-2");
  });

  it("animates progress fill smoothly", () => {
    render(<ProgressIndicator progressPercent={75} />);

    const fill = screen.getByTestId("progress-fill");
    expect(fill).toHaveStyle({ width: "75%" });
    expect(fill).toHaveClass("transition-all");
  });
});
