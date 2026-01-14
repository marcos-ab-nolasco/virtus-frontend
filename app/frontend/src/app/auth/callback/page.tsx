"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CheckCircle, XCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const error = searchParams.get("error");
    const code = searchParams.get("code");

    if (error) {
      setStatus("error");
      setErrorMessage(
        error === "access_denied"
          ? "Você negou o acesso ao Google Calendar"
          : "Erro ao conectar com Google Calendar"
      );
    } else if (code) {
      // OAuth foi bem-sucedido (backend já processou o callback)
      setStatus("success");
      // Redirecionar para settings após 2 segundos
      setTimeout(() => {
        router.push("/settings");
      }, 2000);
    } else {
      setStatus("error");
      setErrorMessage("Parâmetros de callback inválidos");
    }
  }, [searchParams, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Card className="max-w-md w-full text-center">
          <LoadingSpinner size="lg" text="Processando autenticação..." />
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Card className="max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-secondary-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Conectado com sucesso!</h1>
          <p className="text-neutral-600 mb-6">
            Sua conta do Google Calendar foi conectada com sucesso. Redirecionando...
          </p>
          <LoadingSpinner size="sm" />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <Card className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-error-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Erro na conexão</h1>
        <p className="text-neutral-600 mb-6">{errorMessage}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            Voltar ao Dashboard
          </Button>
          <Button variant="primary" onClick={() => router.push("/connect-calendar")}>
            Tentar Novamente
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <LoadingSpinner size="lg" text="Carregando..." />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
