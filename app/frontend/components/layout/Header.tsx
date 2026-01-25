"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import type { components } from "@/types/api";

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
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu toggle */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}

          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary-600">Virtus</h1>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-neutral-100 transition-colors"
              aria-label="Menu do usuário"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-neutral-900">{fullName}</p>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">{userInitial}</span>
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-neutral-200">
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Configurações
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-neutral-100"
                  >
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
