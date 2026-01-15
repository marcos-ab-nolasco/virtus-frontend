interface ProgressIndicatorProps {
  progressPercent: number;
  currentStep?: string;
  currentStepNumber?: number;
  totalSteps?: number;
  compact?: boolean;
}

export function ProgressIndicator({
  progressPercent,
  currentStep,
  currentStepNumber,
  totalSteps,
  compact = false,
}: ProgressIndicatorProps) {
  const hasStepInfo = currentStepNumber !== undefined && totalSteps !== undefined;

  return (
    <div className="w-full">
      {/* Step info row */}
      {(currentStep || hasStepInfo) && (
        <div className="flex items-center justify-between mb-2 text-sm">
          {currentStep && <span className="text-muted-foreground">{currentStep}</span>}
          {hasStepInfo && (
            <span className="text-muted-foreground">
              Passo {currentStepNumber} de {totalSteps}
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div
        data-testid="progress-indicator"
        className={`w-full bg-muted rounded-full overflow-hidden ${compact ? "h-1" : "h-2"}`}
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          data-testid="progress-fill"
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
