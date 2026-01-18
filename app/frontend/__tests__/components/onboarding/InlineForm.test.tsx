import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InlineForm } from "@/components/onboarding/InlineForm";
import type { InlineFormConfig } from "@/types/onboarding";

describe("InlineForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("text input", () => {
    const textConfig: InlineFormConfig = {
      fields: [
        {
          name: "vision",
          type: "text",
          label: "Sua visao",
          placeholder: "Descreva sua visao...",
          required: true,
        },
      ],
      submitLabel: "Enviar",
    };

    it("renders text input field", () => {
      render(<InlineForm config={textConfig} onSubmit={mockOnSubmit} />);

      expect(screen.getByLabelText(/Sua visao/)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Descreva sua visao...")).toBeInTheDocument();
    });

    it("calls onSubmit with form values", async () => {
      const user = userEvent.setup();
      render(<InlineForm config={textConfig} onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/Sua visao/), "Minha visao de futuro");
      await user.click(screen.getByRole("button", { name: "Enviar" }));

      expect(mockOnSubmit).toHaveBeenCalledWith({ vision: "Minha visao de futuro" });
    });

    it("shows validation error for required empty field", async () => {
      const user = userEvent.setup();
      render(<InlineForm config={textConfig} onSubmit={mockOnSubmit} />);

      await user.click(screen.getByRole("button", { name: "Enviar" }));

      expect(screen.getByText("Este campo e obrigatorio")).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe("select input", () => {
    const selectConfig: InlineFormConfig = {
      fields: [
        {
          name: "style",
          type: "select",
          label: "Estilo de comunicacao",
          options: [
            { value: "direct", label: "Direto" },
            { value: "gentle", label: "Gentil" },
            { value: "motivating", label: "Motivador" },
          ],
          required: true,
        },
      ],
      submitLabel: "Continuar",
    };

    it("renders select with options", () => {
      render(<InlineForm config={selectConfig} onSubmit={mockOnSubmit} />);

      expect(screen.getByLabelText(/Estilo de comunicacao/)).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("calls onSubmit with selected value", async () => {
      const user = userEvent.setup();
      render(<InlineForm config={selectConfig} onSubmit={mockOnSubmit} />);

      await user.selectOptions(screen.getByRole("combobox"), "gentle");
      await user.click(screen.getByRole("button", { name: "Continuar" }));

      expect(mockOnSubmit).toHaveBeenCalledWith({ style: "gentle" });
    });
  });

  describe("multi-select input", () => {
    const multiSelectConfig: InlineFormConfig = {
      fields: [
        {
          name: "goals",
          type: "multi-select",
          label: "Suas metas",
          options: [
            { value: "health", label: "Saude" },
            { value: "career", label: "Carreira" },
            { value: "relationships", label: "Relacionamentos" },
          ],
        },
      ],
      submitLabel: "Salvar",
    };

    it("renders multi-select as checkboxes", () => {
      render(<InlineForm config={multiSelectConfig} onSubmit={mockOnSubmit} />);

      expect(screen.getByText("Suas metas")).toBeInTheDocument();
      expect(screen.getByLabelText("Saude")).toBeInTheDocument();
      expect(screen.getByLabelText("Carreira")).toBeInTheDocument();
      expect(screen.getByLabelText("Relacionamentos")).toBeInTheDocument();
    });

    it("calls onSubmit with multiple selected values", async () => {
      const user = userEvent.setup();
      render(<InlineForm config={multiSelectConfig} onSubmit={mockOnSubmit} />);

      await user.click(screen.getByLabelText("Saude"));
      await user.click(screen.getByLabelText("Carreira"));
      await user.click(screen.getByRole("button", { name: "Salvar" }));

      expect(mockOnSubmit).toHaveBeenCalledWith({ goals: ["health", "career"] });
    });
  });

  describe("submitted state", () => {
    const config: InlineFormConfig = {
      fields: [
        {
          name: "name",
          type: "text",
          label: "Nome",
        },
      ],
      submitLabel: "Enviar",
      submitted: true,
      values: { name: "Joao" },
    };

    it("shows read-only view when submitted", () => {
      render(<InlineForm config={config} onSubmit={mockOnSubmit} />);

      expect(screen.getByText("Joao")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Enviar" })).not.toBeInTheDocument();
    });

    it("disables form fields when submitted", () => {
      render(<InlineForm config={config} onSubmit={mockOnSubmit} />);

      const container = screen.getByTestId("inline-form");
      expect(container).toHaveAttribute("data-submitted", "true");
    });
  });

  describe("loading state", () => {
    const config: InlineFormConfig = {
      fields: [{ name: "test", type: "text", label: "Test" }],
      submitLabel: "Enviar",
    };

    it("shows loading state during submission", () => {
      render(<InlineForm config={config} onSubmit={mockOnSubmit} isLoading />);

      const submitButton = screen.getByRole("button", { name: "Enviar" });
      expect(submitButton).toBeDisabled();
    });
  });
});
