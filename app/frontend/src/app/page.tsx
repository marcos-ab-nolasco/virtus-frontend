"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="text-gray-300">Carregando...</div>
        </div>
      </div>
    );
  }

  // Don't render landing page if authenticated (redirect in progress)
  if (isAuthenticated) {
    return null;
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Virtus</h1>
        <p className="text-xl text-gray-300 mb-8">FastAPI + Next.js + PostgreSQL + Redis</p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
