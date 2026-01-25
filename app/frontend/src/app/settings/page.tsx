"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useOAuth } from "@/hooks/useOAuth";
import { useOnboardingGuard } from "@/hooks/useOnboardingGuard";
import MainLayout from "@/components/layout/MainLayout";
import ConnectionStatus from "@/components/features/ConnectionStatus";
import Card from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ToastContainer, type ToastType } from "@/components/ui/Toast";
import * as profileApi from "@/lib/api/profile";
import type { components } from "@/types/api";

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { connections, isLoading, fetchConnections, disconnect } = useOAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCheckingOnboarding } = useOnboardingGuard();
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);
  const handledOAuthRef = useRef<string | null>(null);
  const [profile, setProfile] = useState<components["schemas"]["UserProfileResponse"] | null>(null);
  const [preferences, setPreferences] = useState<
    components["schemas"]["UserPreferencesResponse"] | null
  >(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

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
    if (!isAuthenticated || isCheckingOnboarding) {
      return;
    }

    let isMounted = true;
    setIsProfileLoading(true);
    setProfileError(null);

    Promise.all([profileApi.getMyProfile(), profileApi.getMyPreferences()])
      .then(([profileData, preferencesData]) => {
        if (!isMounted) {
          return;
        }
        setProfile(profileData);
        setPreferences(preferencesData);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }
        const message = error instanceof Error ? error.message : "Falha ao carregar dados.";
        setProfileError(message);
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }
        setIsProfileLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isCheckingOnboarding]);

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
    oauthProvider,
    providerLabel,
    router,
  ]);

  const handleConnect = () => {
    router.push("/connect-calendar");
  };

  const handleDisconnect = async (provider: string) => {
    await disconnect(provider);
  };

  const renderValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") {
      return "Nao informado";
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return "Nao informado";
      }
      return value.join(", ");
    }

    if (typeof value === "boolean") {
      return value ? "Sim" : "Nao";
    }

    return String(value);
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
            <p className="text-neutral-600 mb-6">
              Dados do perfil coletados no onboarding e preferencias da sua conta.
            </p>

            {isProfileLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" text="Carregando dados da conta..." />
              </div>
            ) : profileError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {profileError}
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Perfil</h3>
                  <div className="space-y-3 text-sm text-neutral-700">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-neutral-500">Status do onboarding</span>
                      <span className="font-medium text-neutral-900">
                        {renderValue(profile?.onboarding_status)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-neutral-500">Etapa atual</span>
                      <span className="font-medium text-neutral-900">
                        {renderValue(profile?.onboarding_current_step)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-neutral-500">Visao em 5 anos</span>
                      <span className="font-medium text-neutral-900 text-right">
                        {renderValue(profile?.vision_5_years)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-neutral-500">Temas da visao</span>
                      <span className="font-medium text-neutral-900 text-right">
                        {renderValue(profile?.vision_5_years_themes)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-neutral-500">Maior obstaculo</span>
                      <span className="font-medium text-neutral-900 text-right">
                        {renderValue(profile?.main_obstacle)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-neutral-500">Atividades que dao energia</span>
                      <span className="font-medium text-neutral-900 text-right">
                        {renderValue(profile?.energy_activities)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-neutral-500">Atividades que drenam energia</span>
                      <span className="font-medium text-neutral-900 text-right">
                        {renderValue(profile?.drain_activities)}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Preferencias</h3>
                  <div className="space-y-3 text-sm text-neutral-700">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-neutral-500">Fuso horario</span>
                      <span className="font-medium text-neutral-900">
                        {renderValue(preferences?.timezone)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-neutral-500">Nome do coach</span>
                      <span className="font-medium text-neutral-900">
                        {renderValue(preferences?.coach_name)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-neutral-500">Estilo de comunicacao</span>
                      <span className="font-medium text-neutral-900">
                        {renderValue(preferences?.communication_style)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-neutral-500">Check-in matinal</span>
                      <span className="font-medium text-neutral-900">
                        {renderValue(preferences?.morning_checkin_enabled)} (
                        {renderValue(preferences?.morning_checkin_time)})
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-neutral-500">Check-in noturno</span>
                      <span className="font-medium text-neutral-900">
                        {renderValue(preferences?.evening_checkin_enabled)} (
                        {renderValue(preferences?.evening_checkin_time)})
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-neutral-500">Revisao semanal</span>
                      <span className="font-medium text-neutral-900">
                        {renderValue(preferences?.weekly_review_day)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </section>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </MainLayout>
  );
}
