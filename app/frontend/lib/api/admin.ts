import { authenticatedClient } from "@/lib/api-client";
import type { components } from "@/types/api";

type AdminUserList = components["schemas"]["AdminUserList"];
type UserRead = components["schemas"]["UserRead"];

interface PaginationParams {
  limit: number;
  offset: number;
}

type ApiErrorDetail = components["schemas"]["HTTPValidationError"]["detail"] | undefined;

function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    return error
      .map((item) => (item && typeof item.msg === "string" ? item.msg : null))
      .filter((msg): msg is string => Boolean(msg))
      .join(", ");
  }

  if (error && typeof error === "object" && "detail" in error) {
    const detail = (error as { detail?: unknown }).detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      const messages = (detail as ApiErrorDetail)
        ?.map((item) => (item && typeof item.msg === "string" ? item.msg : null))
        .filter((msg): msg is string => Boolean(msg));

      if (messages && messages.length) {
        return messages.join(", ");
      }
    }
  }

  return fallback;
}

function attachStatus(error: Error, response?: Response): Error & { status?: number } {
  const errorWithStatus = error as Error & { status?: number };
  if (response) {
    errorWithStatus.status = response.status;
  }
  return errorWithStatus;
}

export async function listUsers(params: PaginationParams): Promise<AdminUserList> {
  const { data, error, response } = await authenticatedClient.GET("/admin/users", {
    params: {
      query: {
        limit: params.limit,
        offset: params.offset,
      },
    },
  });

  if (error) {
    const message = extractErrorMessage(error, "Falha ao carregar usuarios.");
    throw attachStatus(new Error(message), response);
  }

  return data;
}

export async function blockUser(userId: string): Promise<UserRead> {
  const { data, error, response } = await authenticatedClient.PATCH(
    "/admin/users/{user_id}/block",
    {
      params: {
        path: {
          user_id: userId,
        },
      },
    }
  );

  if (error) {
    const message = extractErrorMessage(error, "Falha ao bloquear usuario.");
    throw attachStatus(new Error(message), response);
  }

  return data;
}

export async function unblockUser(userId: string): Promise<UserRead> {
  const { data, error, response } = await authenticatedClient.PATCH(
    "/admin/users/{user_id}/unblock",
    {
      params: {
        path: {
          user_id: userId,
        },
      },
    }
  );

  if (error) {
    const message = extractErrorMessage(error, "Falha ao desbloquear usuario.");
    throw attachStatus(new Error(message), response);
  }

  return data;
}

export async function deleteUser(userId: string): Promise<void> {
  const { error, response } = await authenticatedClient.DELETE("/admin/users/{user_id}", {
    params: {
      path: {
        user_id: userId,
      },
    },
  });

  if (error) {
    const message = extractErrorMessage(error, "Falha ao remover usuario.");
    throw attachStatus(new Error(message), response);
  }
}
