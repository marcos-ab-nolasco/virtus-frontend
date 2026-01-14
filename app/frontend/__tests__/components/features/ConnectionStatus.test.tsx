import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConnectionStatus from '@/components/features/ConnectionStatus';

describe('ConnectionStatus', () => {
  it('renders provider name', () => {
    render(
      <ConnectionStatus
        provider="GOOGLE"
        connected={false}
        onConnect={vi.fn()}
        onDisconnect={vi.fn()}
      />
    );
    expect(screen.getByText(/google calendar/i)).toBeInTheDocument();
  });

  it('shows connected badge when connected is true', () => {
    render(
      <ConnectionStatus
        provider="GOOGLE"
        connected={true}
        onConnect={vi.fn()}
        onDisconnect={vi.fn()}
      />
    );
    expect(screen.getByText(/conectado/i)).toBeInTheDocument();
  });

  it('shows disconnected badge when connected is false', () => {
    render(
      <ConnectionStatus
        provider="GOOGLE"
        connected={false}
        onConnect={vi.fn()}
        onDisconnect={vi.fn()}
      />
    );
    expect(screen.getByText(/desconectado/i)).toBeInTheDocument();
  });

  it('displays last sync timestamp when provided', () => {
    const lastSync = '2026-01-13T10:00:00Z';
    render(
      <ConnectionStatus
        provider="GOOGLE"
        connected={true}
        lastSync={lastSync}
        onConnect={vi.fn()}
        onDisconnect={vi.fn()}
      />
    );
    expect(screen.getByText(/última sincronização/i)).toBeInTheDocument();
  });

  it('does not display last sync when not provided', () => {
    render(
      <ConnectionStatus
        provider="GOOGLE"
        connected={true}
        onConnect={vi.fn()}
        onDisconnect={vi.fn()}
      />
    );
    expect(screen.queryByText(/última sincronização/i)).not.toBeInTheDocument();
  });

  it('shows connect button when disconnected', () => {
    render(
      <ConnectionStatus
        provider="GOOGLE"
        connected={false}
        onConnect={vi.fn()}
        onDisconnect={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /conectar/i })).toBeInTheDocument();
  });

  it('shows disconnect button when connected', () => {
    render(
      <ConnectionStatus
        provider="GOOGLE"
        connected={true}
        onConnect={vi.fn()}
        onDisconnect={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /desconectar/i })).toBeInTheDocument();
  });

  it('calls onConnect when connect button is clicked', async () => {
    const handleConnect = vi.fn();
    const user = userEvent.setup();

    render(
      <ConnectionStatus
        provider="GOOGLE"
        connected={false}
        onConnect={handleConnect}
        onDisconnect={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /conectar/i }));
    expect(handleConnect).toHaveBeenCalledTimes(1);
  });

  it('calls onDisconnect when disconnect button is clicked after confirmation', async () => {
    const handleDisconnect = vi.fn();
    const user = userEvent.setup();

    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <ConnectionStatus
        provider="GOOGLE"
        connected={true}
        onConnect={vi.fn()}
        onDisconnect={handleDisconnect}
      />
    );

    await user.click(screen.getByRole('button', { name: /desconectar/i }));
    expect(handleDisconnect).toHaveBeenCalledTimes(1);
  });

  it('does not call onDisconnect when confirmation is cancelled', async () => {
    const handleDisconnect = vi.fn();
    const user = userEvent.setup();

    // Mock window.confirm to return false
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(
      <ConnectionStatus
        provider="GOOGLE"
        connected={true}
        onConnect={vi.fn()}
        onDisconnect={handleDisconnect}
      />
    );

    await user.click(screen.getByRole('button', { name: /desconectar/i }));
    expect(handleDisconnect).not.toHaveBeenCalled();
  });
});
