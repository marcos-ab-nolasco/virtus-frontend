"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const {
    login,
    isAuthenticated,
    isLoading,
    error,
    clearError,
    onboardingStatus,
    isOnboardingLoading,
    onboardingStatusError,
    refreshOnboardingStatus,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (!onboardingStatus && !onboardingStatusError && !isOnboardingLoading) {
      refreshOnboardingStatus()
        .then((status) => {
          if (status && status !== "COMPLETED") {
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

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login(data.email, data.password);
    } catch (err) {
      // Error is handled by the store
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-card shadow-soft p-8 border border-gray-300">
          <h1 className="text-3xl font-heading font-bold text-text mb-2">Login</h1>
          <p className="text-muted mb-6">Entre na sua conta</p>

          {error && (
            <div className="bg-danger-bg border border-danger-text text-danger-text px-4 py-3 rounded-input mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-muted font-body">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-slate-500 hover:underline font-medium">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
