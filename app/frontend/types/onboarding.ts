import type { components } from "./api";

// Re-export API types for convenience
export type OnboardingStartResponse = components["schemas"]["OnboardingStartResponse"];
export type OnboardingMessageRequest = components["schemas"]["OnboardingMessageRequest"];
export type OnboardingMessageResponse = components["schemas"]["OnboardingMessageResponse"];
export type OnboardingStatusResponse = components["schemas"]["OnboardingStatusResponse"];
export type OnboardingSkipResponse = components["schemas"]["OnboardingSkipResponse"];

// Onboarding status values
export type OnboardingStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

// Message for UI representation
export interface OnboardingMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  quickReplies?: QuickReply[];
  form?: InlineFormConfig;
}

export interface QuickReply {
  label: string;
  value: string;
}

// Inline form configuration
export type InlineFormFieldType = "text" | "select" | "multi-select";

export interface SelectOption {
  value: string;
  label: string;
}

export interface InlineFormField {
  name: string;
  type: InlineFormFieldType;
  label?: string;
  placeholder?: string;
  options?: SelectOption[];
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

export interface InlineFormConfig {
  fields: InlineFormField[];
  submitLabel?: string;
  submitted?: boolean;
  values?: Record<string, string | string[]>;
}
