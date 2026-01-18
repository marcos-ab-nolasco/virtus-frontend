"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ToastContainer, type ToastType } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useOnboardingGuard } from "@/hooks/useOnboardingGuard";
import * as adminApi from "@/lib/api/admin";
import type { components } from "@/types/api";

type UserRead = components["schemas"]["UserRead"];

const PAGE_SIZE = 10;

interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
}

type ActionType = "block" | "unblock" | "delete";

function getErrorMessage(action: "list" | ActionType, error: unknown): string {
  const status =
    error && typeof error === "object" && "status" in error
      ? (error as { status?: number }).status
      : undefined;

  if (status === 403) {
    return action === "list"
      ? "Você não tem permissão para acessar usuários."
      : "Você não tem permissão para executar esta ação.";
  }

  if (status === 409) {
    if (action === "block") {
      return "Usuário já está bloqueado.";
    }
    if (action === "unblock") {
      return "Usuário já está desbloqueado.";
    }
    return "Não foi possível remover este usuário.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (action === "list") {
    return "Falha ao carregar usuários.";
  }

  if (action === "block") {
    return "Falha ao bloquear usuário.";
  }

  if (action === "unblock") {
    return "Falha ao desbloquear usuário.";
  }

  return "Falha ao remover usuário.";
}

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { isCheckingOnboarding } = useOnboardingGuard();
  const [users, setUsers] = useState<UserRead[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<{
    id: string | null;
    action: ActionType | null;
  }>({ id: null, action: null });
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const isAdmin = Boolean(user?.is_admin);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);
  const currentPage = useMemo(() => Math.floor(offset / PAGE_SIZE) + 1, [offset]);

  const addToast = useCallback((message: string, type: ToastType) => {
    setToasts((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, message, type },
    ]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const fetchUsers = useCallback(
    async (nextOffset: number) => {
      setIsLoading(true);
      try {
        const data = await adminApi.listUsers({ limit: PAGE_SIZE, offset: nextOffset });
        setUsers(data.users);
        setTotal(data.total);
      } catch (error) {
        addToast(getErrorMessage("list", error), "error");
      } finally {
        setIsLoading(false);
      }
    },
    [addToast]
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && !isAdmin) {
      router.push("/dashboard");
    }
  }, [authLoading, isAdmin, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && isAdmin && !isCheckingOnboarding) {
      fetchUsers(offset);
    }
  }, [fetchUsers, isAuthenticated, isAdmin, isCheckingOnboarding, offset]);

  const handleAction = async (targetUser: UserRead, action: ActionType) => {
    if (!user || targetUser.id === user.id) {
      return;
    }

    setActionLoading({ id: targetUser.id, action });

    try {
      if (action === "block") {
        await adminApi.blockUser(targetUser.id);
        addToast(`Usuário ${targetUser.email} bloqueado com sucesso.`, "success");
      }

      if (action === "unblock") {
        await adminApi.unblockUser(targetUser.id);
        addToast(`Usuário ${targetUser.email} desbloqueado com sucesso.`, "success");
      }

      if (action === "delete") {
        await adminApi.deleteUser(targetUser.id);
        addToast(`Usuário ${targetUser.email} removido com sucesso.`, "success");
        if (users.length === 1 && offset > 0) {
          setOffset(offset - PAGE_SIZE);
          return;
        }
      }

      await fetchUsers(offset);
    } catch (error) {
      addToast(getErrorMessage(action, error), "error");
    } finally {
      setActionLoading({ id: null, action: null });
    }
  };

  const handleDelete = async (targetUser: UserRead) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja remover ${targetUser.email}? Esta ação não pode ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    await handleAction(targetUser, "delete");
  };

  if (authLoading || isCheckingOnboarding || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Administração de usuários</h1>
          <p className="text-neutral-600 mt-2">
            Gerencie usuários ativos, bloqueados ou removidos.
          </p>
        </div>

        <Card>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner size="md" text="Carregando usuários..." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-100">
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  )}
                  {users.map((item) => {
                    const isSelf = user?.id === item.id;
                    const isBlocked = item.is_blocked;
                    const isActionLoading = actionLoading.id === item.id;
                    const actionLabel = isBlocked ? "Desbloquear" : "Bloquear";
                    const actionType = isBlocked ? "unblock" : "block";

                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-4 text-sm text-neutral-900">
                          <div className="flex items-center gap-2">
                            <span>{item.full_name || "Sem nome"}</span>
                            {isSelf && <Badge size="sm">Você</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-neutral-700">{item.email}</td>
                        <td className="px-4 py-4">
                          <Badge variant={isBlocked ? "error" : "success"}>
                            {isBlocked ? "Bloqueado" : "Ativo"}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant={isBlocked ? "secondary" : "danger"}
                              disabled={isSelf || isActionLoading}
                              title={
                                isSelf ? "Você não pode alterar sua própria conta." : undefined
                              }
                              onClick={() => handleAction(item, actionType)}
                            >
                              {isActionLoading && actionLoading.action === actionType
                                ? "Aguarde..."
                                : actionLabel}
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              disabled={isSelf || isActionLoading}
                              title={
                                isSelf ? "Você não pode remover sua própria conta." : undefined
                              }
                              onClick={() => handleDelete(item)}
                            >
                              {isActionLoading && actionLoading.action === "delete"
                                ? "Aguarde..."
                                : "Remover"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between text-sm text-neutral-600">
            <span>
              Página {currentPage} de {totalPages} • Total: {total}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={offset === 0 || isLoading}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={offset + PAGE_SIZE >= total || isLoading}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </MainLayout>
  );
}
