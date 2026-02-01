"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register: registerUser,
    isAuthenticated,
    isLoading,
    error,
    clearError,
    onboardingStatus,
    onboardingStatusError,
    isOnboardingLoading,
    refreshOnboardingStatus,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (!onboardingStatus && !onboardingStatusError && !isOnboardingLoading) {
      refreshOnboardingStatus()
        .then((status) => {
          if (!status || status !== "COMPLETED") {
            router.push("/onboarding");
            return;
          }
          router.push("/dashboard");
        })
        .catch((err) => {
          console.error("Failed to refresh onboarding status:", err);
          router.push("/onboarding");
        });
      return;
    }

    if (onboardingStatusError || (onboardingStatus && onboardingStatus !== "COMPLETED")) {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  }, [
    isAuthenticated,
    isOnboardingLoading,
    onboardingStatus,
    onboardingStatusError,
    refreshOnboardingStatus,
    router,
  ]);

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    try {
      await registerUser(data.email, data.password, data.fullName);
    } catch (err) {
      // Error is handled by the store
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-card shadow-soft p-8 border border-gray-300">
          <h1 className="text-3xl font-heading font-bold text-text mb-2">Criar Conta</h1>
          <p className="text-muted mb-6">Registre-se para começar</p>

          {error && (
            <div className="bg-danger-bg border border-danger-text text-danger-text px-4 py-3 rounded-input mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nome Completo"
              type="text"
              placeholder="João Silva"
              error={errors.fullName?.message}
              {...register("fullName")}
            />

            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          <p className="mt-6 text-center text-muted font-body">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-slate-500 hover:underline font-medium">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
