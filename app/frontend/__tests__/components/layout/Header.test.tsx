import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/components/layout/Header";

describe("Header", () => {
  const mockUser = {
    id: "1",
    email: "test@example.com",
    full_name: "Test User",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  it("renders logo", () => {
    render(<Header user={mockUser} onLogout={vi.fn()} />);
    expect(screen.getByText(/virtus/i)).toBeInTheDocument();
  });

  it("renders user name", () => {
    render(<Header user={mockUser} onLogout={vi.fn()} />);
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });

  it("shows user menu on click", async () => {
    const user = userEvent.setup();
    render(<Header user={mockUser} onLogout={vi.fn()} />);

    const menuButton = screen.getByRole("button", { name: /menu/i });
    await user.click(menuButton);

    expect(screen.getByText(/configurações/i)).toBeInTheDocument();
    expect(screen.getByText(/sair/i)).toBeInTheDocument();
  });

  it("calls onLogout when logout button is clicked", async () => {
    const handleLogout = vi.fn();
    const user = userEvent.setup();

    render(<Header user={mockUser} onLogout={handleLogout} />);

    const menuButton = screen.getByRole("button", { name: /menu/i });
    await user.click(menuButton);

    const logoutButton = screen.getByRole("button", { name: /sair/i });
    await user.click(logoutButton);

    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it("renders mobile menu toggle button", () => {
    render(<Header user={mockUser} onLogout={vi.fn()} onToggleMobileMenu={vi.fn()} />);
    const toggleButton = screen.getByRole("button", { name: /toggle menu/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it("calls onToggleMobileMenu when toggle button is clicked", async () => {
    const handleToggle = vi.fn();
    const user = userEvent.setup();

    render(<Header user={mockUser} onLogout={vi.fn()} onToggleMobileMenu={handleToggle} />);

    const toggleButton = screen.getByRole("button", { name: /toggle menu/i });
    await user.click(toggleButton);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
