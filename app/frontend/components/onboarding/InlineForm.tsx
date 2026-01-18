"use client";

import { useState } from "react";
import type { InlineFormConfig, InlineFormField } from "@/types/onboarding";

interface InlineFormProps {
  config: InlineFormConfig;
  onSubmit: (values: Record<string, string | string[]>) => void;
  isLoading?: boolean;
}

export function InlineForm({ config, onSubmit, isLoading = false }: InlineFormProps) {
  const [values, setValues] = useState<Record<string, string | string[]>>(config.values ?? {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isSubmitted = config.submitted ?? false;

  const handleTextChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMultiSelectChange = (name: string, value: string, checked: boolean) => {
    setValues((prev) => {
      const current = (prev[name] as string[]) || [];
      if (checked) {
        return { ...prev, [name]: [...current, value] };
      }
      return { ...prev, [name]: current.filter((v) => v !== value) };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const field of config.fields) {
      const value = values[field.name];

      if (field.required) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.name] = "Este campo e obrigatorio";
        }
      }

      if (field.minLength && typeof value === "string" && value.length < field.minLength) {
        newErrors[field.name] = `Minimo de ${field.minLength} caracteres`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(values);
  };

  const renderField = (field: InlineFormField) => {
    if (isSubmitted) {
      return renderReadOnlyField(field);
    }

    switch (field.type) {
      case "text":
        return renderTextField(field);
      case "select":
        return renderSelectField(field);
      case "multi-select":
        return renderMultiSelectField(field);
      default:
        return null;
    }
  };

  const renderReadOnlyField = (field: InlineFormField) => {
    const value = config.values?.[field.name];

    if (Array.isArray(value)) {
      const labels = value
        .map((v) => field.options?.find((opt) => opt.value === v)?.label ?? v)
        .join(", ");
      return (
        <div key={field.name} className="text-sm">
          <span className="font-medium text-muted-foreground">{field.label}: </span>
          <span>{labels}</span>
        </div>
      );
    }

    const displayValue =
      field.type === "select"
        ? (field.options?.find((opt) => opt.value === value)?.label ?? value)
        : value;

    return (
      <div key={field.name} className="text-sm">
        {field.label && <span className="font-medium text-muted-foreground">{field.label}: </span>}
        <span>{displayValue}</span>
      </div>
    );
  };

  const renderTextField = (field: InlineFormField) => {
    const error = errors[field.name];

    return (
      <div key={field.name} className="space-y-1">
        <label htmlFor={field.name} className="block text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </label>
        <textarea
          id={field.name}
          name={field.name}
          value={(values[field.name] as string) ?? ""}
          onChange={(e) => handleTextChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          className={`w-full px-3 py-2 text-sm border rounded-lg resize-none bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            error ? "border-destructive" : "border-input"
          }`}
          rows={3}
          disabled={isLoading}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  };

  const renderSelectField = (field: InlineFormField) => {
    const error = errors[field.name];

    return (
      <div key={field.name} className="space-y-1">
        <label htmlFor={field.name} className="block text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </label>
        <select
          id={field.name}
          name={field.name}
          value={(values[field.name] as string) ?? ""}
          onChange={(e) => handleSelectChange(field.name, e.target.value)}
          className={`w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            error ? "border-destructive" : "border-input"
          }`}
          disabled={isLoading}
        >
          <option value="">Selecione...</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  };

  const renderMultiSelectField = (field: InlineFormField) => {
    const selectedValues = (values[field.name] as string[]) || [];

    return (
      <div key={field.name} className="space-y-2">
        <span className="block text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </span>
        <div className="flex flex-wrap gap-2">
          {field.options?.map((option) => {
            const isChecked = selectedValues.includes(option.value);
            return (
              <label
                key={option.value}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm border rounded-full cursor-pointer transition-colors ${
                  isChecked
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover:border-primary/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    handleMultiSelectChange(field.name, option.value, e.target.checked)
                  }
                  className="sr-only"
                  disabled={isLoading}
                />
                {option.label}
              </label>
            );
          })}
        </div>
        {errors[field.name] && <p className="text-xs text-destructive">{errors[field.name]}</p>}
      </div>
    );
  };

  return (
    <form
      data-testid="inline-form"
      data-submitted={isSubmitted}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {config.fields.map(renderField)}

      {!isSubmitted && (
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {config.submitLabel ?? "Enviar"}
        </button>
      )}
    </form>
  );
}
