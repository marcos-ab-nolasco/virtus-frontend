import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '@/components/ui/Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText(/card content/i)).toBeInTheDocument();
  });

  it('applies small padding variant', () => {
    render(<Card padding="sm">Small padding</Card>);
    const card = screen.getByText(/small padding/i).parentElement;
    expect(card).toHaveClass('p-3');
  });

  it('applies medium padding variant', () => {
    render(<Card padding="md">Medium padding</Card>);
    const card = screen.getByText(/medium padding/i).parentElement;
    expect(card).toHaveClass('p-4');
  });

  it('applies large padding variant', () => {
    render(<Card padding="lg">Large padding</Card>);
    const card = screen.getByText(/large padding/i).parentElement;
    expect(card).toHaveClass('p-6');
  });

  it('applies shadow when shadow prop is true', () => {
    render(<Card shadow>Shadowed card</Card>);
    const card = screen.getByText(/shadowed card/i).parentElement;
    expect(card).toHaveClass('shadow-md');
  });

  it('does not apply shadow when shadow prop is false', () => {
    render(<Card shadow={false}>No shadow</Card>);
    const card = screen.getByText(/no shadow/i).parentElement;
    expect(card).not.toHaveClass('shadow-md');
  });

  it('applies custom className', () => {
    render(<Card className="custom-card">Custom</Card>);
    const card = screen.getByText(/custom/i).parentElement;
    expect(card).toHaveClass('custom-card');
  });
});
