"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import type { components } from "@/types/api";
import ThemeToggle from "@/components/ui/ThemeToggle";

type User = components["schemas"]["UserRead"];

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onToggleMobileMenu?: () => void;
}

export default function Header({ user, onLogout, onToggleMobileMenu }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fullName = user.full_name ?? "";
  const userInitial = fullName.charAt(0).toUpperCase();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout();
  };

  return (
    <header className="bg-surface border-b border-gray-300 sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu toggle */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-slate-500 hover:bg-slate-500/10"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}

          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-heading font-bold text-slate-500">Virtus</h1>
          </div>

          {/* Theme toggle and User menu */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* User menu */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="flex items-center gap-2 px-3 py-2 rounded-pill hover:bg-slate-500/10 transition-colors"
                aria-label="Menu do usuário"
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-body font-medium text-text">{fullName}</p>
                    <p className="text-xs font-body text-muted">{user.email}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-500/20 flex items-center justify-center">
                    <span className="text-sm font-heading font-medium text-slate-500">
                      {userInitial}
                    </span>
                  </div>
                </div>
              </button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-input shadow-soft py-1 z-20 border border-gray-300">
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm font-body text-text hover:bg-slate-500/10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Configurações
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm font-body text-danger-text hover:bg-slate-500/10"
                    >
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
