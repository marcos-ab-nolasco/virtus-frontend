import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainLayout from '@/components/layout/MainLayout';

// Mock usePathname from next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('MainLayout', () => {
  it('renders children correctly', () => {
    render(
      <MainLayout>
        <div>Main content</div>
      </MainLayout>
    );
    expect(screen.getByText(/main content/i)).toBeInTheDocument();
  });

  it('renders header component', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    // Header should contain logo or app name
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders sidebar on desktop', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    // Sidebar should be present in the document
    const sidebar = screen.getByRole('navigation', { name: /sidebar/i });
    expect(sidebar).toBeInTheDocument();
  });

  it('hides sidebar when showSidebar is false', () => {
    render(
      <MainLayout showSidebar={false}>
        <div>Content</div>
      </MainLayout>
    );
    const sidebar = screen.queryByRole('navigation', { name: /sidebar/i });
    expect(sidebar).not.toBeInTheDocument();
  });

  it('renders mobile navigation', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    const mobileNav = screen.getByRole('navigation', { name: /mobile/i });
    expect(mobileNav).toBeInTheDocument();
  });
});
