"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useOAuth } from "@/hooks/useOAuth";
import { useOnboardingGuard } from "@/hooks/useOnboardingGuard";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Calendar, CheckCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ConnectCalendarPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { initiateOAuth, isLoading, error, clearError } = useOAuth();
  const router = useRouter();
  const { isCheckingOnboarding } = useOnboardingGuard();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleConnect = async () => {
    clearError();
    await initiateOAuth("google");
  };

  if (authLoading || isCheckingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <Card padding="lg">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Conectar Google Calendar</h1>

            <p className="text-neutral-600 mb-8">
              Conecte sua conta do Google para que o Virtus possa acessar e gerenciar seus eventos
              de calendário automaticamente.
            </p>

            <div className="bg-neutral-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-neutral-900 mb-3">O que você pode fazer:</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                  <span>Criar eventos automaticamente através do chat</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                  <span>Consultar sua agenda e compromissos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                  <span>Receber lembretes e sugestões inteligentes</span>
                </li>
              </ul>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-md">
                <p className="text-sm text-error-700">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push("/dashboard")}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleConnect}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Conectando...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    <span>Conectar Google Calendar</span>
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-neutral-500 mt-6">
              Ao conectar, você será redirecionado para o Google para autorizar o acesso.
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
