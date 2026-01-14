'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useAuth } from '@/hooks/useAuth';

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // If no user, don't render layout (redirect should happen in page)
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <Header
        user={user}
        onLogout={handleLogout}
        onToggleMobileMenu={showSidebar ? toggleMobileSidebar : undefined}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Desktop */}
        {showSidebar && (
          <aside className="hidden lg:block">
            <Sidebar />
          </aside>
        )}

        {/* Sidebar - Mobile (overlay) */}
        {showSidebar && isMobileSidebarOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-neutral-900 bg-opacity-50 z-30"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            <aside className="lg:hidden fixed left-0 top-16 bottom-0 z-40 w-64">
              <Sidebar />
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
