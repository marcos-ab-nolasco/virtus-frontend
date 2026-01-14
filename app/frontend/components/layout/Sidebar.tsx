'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Calendar, Settings } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Início',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Chat',
    href: '/dashboard/chat',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    label: 'Planos',
    href: '/dashboard/plans',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    label: 'Configurações',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className="w-64 bg-white border-r border-neutral-200 h-full"
      aria-label="Sidebar navigation"
    >
      <div className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={twMerge(
                'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
                active
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-neutral-700 hover:bg-neutral-50'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
