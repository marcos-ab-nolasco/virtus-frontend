"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const emailSchema = z.object({
  email: z.email({ message: "Por favor, insira um email válido" }),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function Home() {
  const {
    isAuthenticated,
    isLoading,
    onboardingStatus,
    onboardingStatusError,
    isOnboardingLoading,
    refreshOnboardingStatus,
  } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  // Redirect authenticated users based on onboarding status
  useEffect(() => {
    if (!isAuthenticated || isLoading) {
      return;
    }

    if (!onboardingStatus && !isOnboardingLoading) {
      refreshOnboardingStatus()
        .then((status) => {
          if (!status || status !== "COMPLETED") {
            router.replace("/onboarding");
            return;
          }
          router.replace("/dashboard");
        })
        .catch((error) => {
          console.error("Failed to refresh onboarding status:", error);
          router.replace("/onboarding");
        });
      return;
    }

    if (onboardingStatusError || (onboardingStatus && onboardingStatus !== "COMPLETED")) {
      router.replace("/onboarding");
      return;
    }

    if (onboardingStatus === "COMPLETED") {
      router.replace("/dashboard");
    }
  }, [
    isAuthenticated,
    isLoading,
    isOnboardingLoading,
    onboardingStatus,
    onboardingStatusError,
    refreshOnboardingStatus,
    router,
  ]);

  const onSubmit = (data: EmailFormData) => {
    // TODO: Phase 1+ - implement waitlist backend integration
    console.log("Waitlist email:", data.email);
    alert(`Obrigado! ${data.email} foi adicionado à lista de espera.`);
  };

  // Show loading state while checking authentication
  if (
    isLoading ||
    (isAuthenticated && (isOnboardingLoading || (!onboardingStatus && !onboardingStatusError)))
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-muted">Carregando...</div>
        </div>
      </div>
    );
  }

  // Don't render landing page if authenticated (redirect in progress)
  if (isAuthenticated) {
    return null;
  }

  // Show waitlist page for unauthenticated users
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-300" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-heading font-bold text-slate-500">Virtus</h1>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-heading font-medium text-slate-500 hover:bg-slate-500/10 rounded-pill transition-colors"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 sm:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-text mb-6">
              Produtividade não é fazer mais. É fazer o que importa.
            </h2>
            <p className="text-lg sm:text-xl text-muted mb-10 max-w-2xl mx-auto">
              Virtus é um coach digital que transforma propósito em ação diária, sem ruído.
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <div className="flex-1">
                  <Input
                    {...register("email")}
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    error={errors.email?.message}
                    className="w-full"
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" className="sm:w-auto">
                  Entrar na órbita
                </Button>
              </div>
              <p className="text-sm text-muted">Sem spam. Só quando fizer sentido.</p>
            </form>
          </div>
        </section>

        {/* Promise Section */}
        <section className="py-16 bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl sm:text-4xl font-heading font-bold text-text mb-4">
              Clareza contínua, não listas infinitas.
            </h3>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Planejamento leve, reflexão guiada e acompanhamento gentil para manter ritmo sem se
              perder.
            </p>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <h4 className="text-xl font-heading font-semibold text-text mb-3">
                  Direção antes de ação
                </h4>
                <p className="text-muted">Pequenas decisões alinhadas a objetivos reais.</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-heading font-semibold text-text mb-3">
                  Ritmo sustentável
                </h4>
                <p className="text-muted">Planejamento que respeita energia, não só tempo.</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-heading font-semibold text-text mb-3">
                  Reflexão guiada
                </h4>
                <p className="text-muted">A pergunta certa, no momento certo.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-surface">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl sm:text-4xl font-heading font-bold text-text text-center mb-12">
              Como funciona
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <div className="text-gold-500 font-heading font-bold text-5xl mb-4">1</div>
                <h4 className="text-xl font-heading font-semibold text-text mb-3">
                  Comece pelo que importa
                </h4>
                <p className="text-muted">Um desejo central vira um objetivo semanal claro.</p>
              </div>
              <div>
                <div className="text-gold-500 font-heading font-bold text-5xl mb-4">2</div>
                <h4 className="text-xl font-heading font-semibold text-text mb-3">
                  Organize com leveza
                </h4>
                <p className="text-muted">A IA distribui, você ajusta.</p>
              </div>
              <div>
                <div className="text-gold-500 font-heading font-bold text-5xl mb-4">3</div>
                <h4 className="text-xl font-heading font-semibold text-text mb-3">
                  Acompanhe sem culpa
                </h4>
                <p className="text-muted">Check-ins curtos e reentrada gentil.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm text-muted">
              <Link href="#" className="hover:text-text transition-colors">
                Sobre
              </Link>
              <Link href="#" className="hover:text-text transition-colors">
                Privacidade
              </Link>
              <Link href="#" className="hover:text-text transition-colors">
                Contato
              </Link>
            </div>
            <p className="text-sm text-muted">© 2026 Virtus</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
