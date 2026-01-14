import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInput from '@/components/features/ChatInput';

describe('ChatInput', () => {
  it('renders textarea with placeholder', () => {
    render(<ChatInput onSend={vi.fn()} placeholder="Type a message..." />);
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
  });

  it('calls onSend when send button is clicked', async () => {
    const handleSend = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSend={handleSend} />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Hello world');

    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);

    expect(handleSend).toHaveBeenCalledWith('Hello world');
  });

  it('clears textarea after sending message', async () => {
    const handleSend = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSend={handleSend} />);

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    await user.type(textarea, 'Test message');

    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);

    expect(textarea.value).toBe('');
  });

  it('calls onSend when Enter is pressed', async () => {
    const handleSend = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSend={handleSend} />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Hello{Enter}');

    expect(handleSend).toHaveBeenCalledWith('Hello');
  });

  it('does not send when Shift+Enter is pressed', async () => {
    const handleSend = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSend={handleSend} />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Line 1{Shift>}{Enter}{/Shift}Line 2');

    expect(handleSend).not.toHaveBeenCalled();
  });

  it('does not send empty messages', async () => {
    const handleSend = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSend={handleSend} />);

    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);

    expect(handleSend).not.toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<ChatInput onSend={vi.fn()} disabled />);

    const textarea = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });

    expect(textarea).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });

  it('does not send when disabled', async () => {
    const handleSend = vi.fn();
    const user = userEvent.setup();

    render(<ChatInput onSend={handleSend} disabled />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Test');

    // Textarea is disabled, so typing won't work
    expect(handleSend).not.toHaveBeenCalled();
  });
});
