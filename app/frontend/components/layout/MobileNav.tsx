"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Calendar, Settings } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Início",
    href: "/dashboard",
    icon: <Home className="w-6 h-6" />,
  },
  {
    label: "Chat",
    href: "/dashboard/chat",
    icon: <MessageSquare className="w-6 h-6" />,
  },
  {
    label: "Planos",
    href: "/dashboard/plans",
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    label: "Configurações",
    href: "/settings",
    icon: <Settings className="w-6 h-6" />,
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-40"
      aria-label="Mobile navigation"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={twMerge(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-md transition-colors min-w-0 flex-1",
                active ? "text-primary-600" : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              {item.icon}
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
