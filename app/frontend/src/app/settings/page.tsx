"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useOAuth } from "@/hooks/useOAuth";
import { useOnboardingGuard } from "@/hooks/useOnboardingGuard";
import MainLayout from "@/components/layout/MainLayout";
import ConnectionStatus from "@/components/features/ConnectionStatus";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ToastContainer, type ToastType } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { connections, isLoading, fetchConnections, disconnect } = useOAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCheckingOnboarding } = useOnboardingGuard();
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);
  const handledOAuthRef = useRef<string | null>(null);

  const oauthStatus = searchParams.get("status");
  const oauthProvider = searchParams.get("provider");
  const oauthReason = searchParams.get("reason");
  const oauthIntegrationId = searchParams.get("integration_id");

  const providerLabel = useMemo(() => {
    if (!oauthProvider) {
      return "integração";
    }

    if (oauthProvider.toLowerCase() === "google") {
      return "Google Calendar";
    }

    return oauthProvider;
  }, [oauthProvider]);

  const addToast = useCallback((message: string, type: ToastType) => {
    setToasts((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, message, type },
    ]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && !isCheckingOnboarding) {
      fetchConnections();
    }
  }, [isAuthenticated, isCheckingOnboarding, fetchConnections]);

  useEffect(() => {
    if (!oauthStatus) {
      return;
    }

    const signature = `${oauthStatus}|${oauthProvider ?? ""}|${oauthReason ?? ""}|${
      oauthIntegrationId ?? ""
    }`;
    if (handledOAuthRef.current === signature) {
      return;
    }
    handledOAuthRef.current = signature;

    if (oauthStatus === "connected") {
      addToast(`Integração com ${providerLabel} concluída com sucesso.`, "success");
      if (isAuthenticated) {
        fetchConnections();
      }
    } else if (oauthStatus === "failed") {
      const reasonMap: Record<string, string> = {
        invalid_state: "Sessão expirada, tente novamente.",
        oauth_error: "Falha ao falar com o Google.",
        internal_error: "Erro interno. Tente novamente.",
        oauth_failed: "Não foi possível conectar.",
        access_denied: "Conexão cancelada pelo usuário.",
      };
      const reasonText = oauthReason ? reasonMap[oauthReason] : undefined;
      const message = reasonText
        ? `Falha ao conectar ${providerLabel}: ${reasonText}`
        : `Falha ao conectar ${providerLabel}.`;
      addToast(message, "error");
    }

    if (oauthIntegrationId) {
      // Reserved for future use; keep param parsed for potential UI updates.
    }

    router.replace("/settings");
  }, [
    addToast,
    fetchConnections,
    isAuthenticated,
    oauthIntegrationId,
    oauthReason,
    oauthStatus,
    providerLabel,
    router,
  ]);

  const handleConnect = () => {
    router.push("/connect-calendar");
  };

  const handleDisconnect = async (provider: string) => {
    await disconnect(provider);
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Configurações</h1>

        <div className="space-y-8">
          {/* Integrations Section */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Integrações</h2>
            <p className="text-neutral-600 mb-6">
              Gerencie suas integrações com serviços de calendário e outras ferramentas.
            </p>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" text="Carregando integrações..." />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Google Calendar */}
                {(() => {
                  const googleConnection = connections.find(
                    (connection) => connection.provider === "GOOGLE_CALENDAR"
                  );
                  const isConnected = googleConnection?.status === "ACTIVE";
                  return (
                    <ConnectionStatus
                      provider="GOOGLE_CALENDAR"
                      connected={isConnected}
                      lastSync={googleConnection?.last_sync_at ?? undefined}
                      onConnect={handleConnect}
                      onDisconnect={() => {
                        if (!googleConnection) {
                          return;
                        }
                        void handleDisconnect(googleConnection.id);
                      }}
                    />
                  );
                })()}

                {/* Placeholder for future integrations */}
                {connections.length === 0 && (
                  <div className="text-center py-8 text-neutral-500">
                    Nenhuma integração configurada.
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Account Section */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Conta</h2>
            <p className="text-neutral-600">Configurações de conta estarão disponíveis em breve.</p>
          </section>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </MainLayout>
  );
}
