"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useOAuth } from "@/hooks/useOAuth";
import MainLayout from "@/components/layout/MainLayout";
import ConnectionStatus from "@/components/features/ConnectionStatus";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function SettingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { connections, isLoading, fetchConnections, disconnect } = useOAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConnections();
    }
  }, [isAuthenticated, fetchConnections]);

  const handleConnect = () => {
    router.push("/connect-calendar");
  };

  const handleDisconnect = async (provider: string) => {
    await disconnect(provider);
  };

  if (authLoading) {
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
    </MainLayout>
  );
}
