"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  MessageSquare,
  Calendar,
  Settings,
  Shield,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems: NavItem[] = [
    {
      label: "Início",
      href: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Chat",
      href: "/dashboard/chat",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      label: "Planos",
      href: "/dashboard/plans",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: "Configurações",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
    ...(user?.is_admin
      ? [
          {
            label: "Admin",
            href: "/admin",
            icon: <Shield className="w-5 h-5" />,
          },
        ]
      : []),
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className={twMerge(
        "relative bg-surface border-r border-border h-full transition-[width] duration-200",
        collapsed ? "w-20" : "w-64"
      )}
      aria-label="Sidebar navigation"
    >
      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex absolute -right-3 top-6 h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-slate-500 shadow-sm opacity-30 transition hover:opacity-100"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      )}
      <div className={twMerge("flex flex-col gap-1 p-4", collapsed && "px-3")}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={twMerge(
                "relative flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                collapsed && "justify-center px-2",
                active
                  ? twMerge(
                      "bg-slate-500/10 text-slate-600 font-medium dark:text-bone-50 dark:bg-slate-500/20 before:content-[''] before:absolute before:top-2 before:bottom-2 before:w-1 before:rounded-full before:bg-slate-500",
                      collapsed ? "before:left-1" : "before:left-2"
                    )
                  : "text-slate-600 hover:bg-slate-500/10 dark:text-bone-50/70 dark:hover:bg-slate-500/10"
              )}
            >
              {item.icon}
              <span className={collapsed ? "sr-only" : undefined}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
