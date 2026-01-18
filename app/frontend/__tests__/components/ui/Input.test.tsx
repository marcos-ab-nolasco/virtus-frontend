import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "@/components/ui/Input";

describe("Input", () => {
  it("renders input with label", () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("displays error message when error prop is provided", () => {
    render(<Input label="Email" name="email" error="Email is required" />);
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it("applies error styles when error is present", () => {
    render(<Input label="Email" name="email" error="Invalid" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-error-500");
  });

  it("calls onChange when value changes", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input label="Email" name="email" onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "test@example.com");

    expect(handleChange).toHaveBeenCalled();
  });

  it("displays placeholder text", () => {
    render(<Input label="Email" name="email" placeholder="Enter your email" />);
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
  });

  it("sets input type correctly", () => {
    render(<Input label="Password" name="password" type="password" />);
    const input = screen.getByLabelText(/password/i);
    expect(input).toHaveAttribute("type", "password");
  });

  it("applies required attribute when required prop is true", () => {
    render(<Input label="Email" name="email" required />);
    const input = screen.getByRole("textbox");
    expect(input).toBeRequired();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input label="Email" name="email" disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("renders without label when label prop is not provided", () => {
    render(<Input name="email" />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("connects label to input with htmlFor", () => {
    render(<Input label="Email" name="email" />);
    const label = screen.getByText(/email/i);
    const input = screen.getByRole("textbox");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("applies custom className", () => {
    render(<Input label="Email" name="email" className="custom-input" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("custom-input");
  });
});
