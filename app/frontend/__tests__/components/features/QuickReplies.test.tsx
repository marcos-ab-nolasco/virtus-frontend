import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuickReplies from '@/components/features/QuickReplies';

describe('QuickReplies', () => {
  const mockOptions = [
    { text: 'Sim', value: 'yes' },
    { text: 'Não', value: 'no' },
    { text: 'Talvez', value: 'maybe' },
  ];

  it('renders all quick reply options', () => {
    render(<QuickReplies options={mockOptions} onSelect={vi.fn()} />);

    expect(screen.getByRole('button', { name: /sim/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /não/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /talvez/i })).toBeInTheDocument();
  });

  it('calls onSelect with correct value when option is clicked', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();

    render(<QuickReplies options={mockOptions} onSelect={handleSelect} />);

    await user.click(screen.getByRole('button', { name: /sim/i }));

    expect(handleSelect).toHaveBeenCalledWith('yes');
  });

  it('disables all buttons after selection', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();

    render(<QuickReplies options={mockOptions} onSelect={handleSelect} />);

    await user.click(screen.getByRole('button', { name: /sim/i }));

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('is disabled when disabled prop is true', () => {
    render(<QuickReplies options={mockOptions} onSelect={vi.fn()} disabled />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('does not call onSelect when disabled', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();

    render(<QuickReplies options={mockOptions} onSelect={handleSelect} disabled />);

    await user.click(screen.getByRole('button', { name: /sim/i }));

    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('renders empty state when no options provided', () => {
    const { container } = render(<QuickReplies options={[]} onSelect={vi.fn()} />);

    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('supports horizontal scrolling on mobile', () => {
    const { container } = render(<QuickReplies options={mockOptions} onSelect={vi.fn()} />);

    const scrollContainer = container.firstChild as HTMLElement;
    expect(scrollContainer).toHaveClass('overflow-x-auto');
  });
});
