"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/ui/DashboardSkeleton";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import { useOnboardingGuard } from "@/hooks/useOnboardingGuard";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { isCheckingOnboarding } = useOnboardingGuard();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isCheckingOnboarding || !isAuthenticated) {
    return <DashboardSkeleton />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Bem-vindo, {user?.full_name}!
          </h2>
          <div className="space-y-2 text-neutral-700">
            <p>
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-semibold">ID:</span> {user?.id}
            </p>
          </div>
        </Card>

        {/* Chat Card */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/chat"
            className="block bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Chat com IA
                </h3>
                <p className="text-blue-100 mb-4">
                  Converse com diferentes modelos de IA: OpenAI, Anthropic, Gemini e Grok
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <span className="px-2 py-1 bg-white/20 rounded">GPT-4</span>
                  <span className="px-2 py-1 bg-white/20 rounded">Claude</span>
                  <span className="px-2 py-1 bg-white/20 rounded">Gemini</span>
                </div>
              </div>
              <svg
                className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </Link>

          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">🚀 Funcionalidades</h3>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Múltiplos provedores de IA</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Conversas organizadas</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>System prompts personalizados</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Info Banner */}
        <Card className="bg-primary-50 border-primary-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            🎉 Autenticação funcionando!
          </h3>
          <p className="text-primary-800">
            Você está autenticado e visualizando uma rota protegida. O token JWT está sendo
            armazenado no localStorage e injetado automaticamente em todas as requisições.
          </p>
        </Card>
      </div>
    </MainLayout>
  );
}
