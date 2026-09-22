import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import type {
  DefaultOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toaster } from "@/components/ui";
import { getErrorMessage } from "@/utils/handle-error";

export type MutationMeta = {
  successMessage?: string;
  /** Fallback when the server sends no message of its own. */
  errorMessage?: string;
  /** Opt out of the global error toast, for mutations with their own error UI. */
  silent?: boolean;
  /** Each inner array is one query key, e.g. [['invoices'], ['invoice', id]] */
  invalidatesQueryKeys?: readonly (readonly unknown[])[];
};

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: { toastOnError?: boolean };
    mutationMeta: MutationMeta;
  }
}

const defaultOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 300_000, // 5 minutes
    gcTime: 3_600_000, // 1 hour
  },
  mutations: {
    retry: false,
    gcTime: 0,
  },
};

export const queryClient = new QueryClient({
  defaultOptions,
  // Queries show failures inline; opt in to a toast with `meta: { toastOnError: true }`.
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (!query.meta?.toastOnError) return;
      toaster.create({
        description:
          getErrorMessage(error) || "Something went wrong. Please try again.",
        type: "error",
      });
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation.meta?.successMessage) {
        toaster.create({
          description: mutation.meta.successMessage,
          type: "success",
        });
      }
      mutation.meta?.invalidatesQueryKeys?.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: queryKey as unknown[] });
      });
    },
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.silent) return;
      toaster.create({
        description:
          getErrorMessage(error) ||
          mutation.meta?.errorMessage ||
          "Something went wrong. Please try again.",
        type: "error",
      });
    },
  }),
});

export type QueryConfigType<Fn extends (...args: any) => Promise<any>> = Omit<
  UseQueryOptions<Awaited<ReturnType<Fn>>, AxiosError>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<Fn extends (...args: any) => Promise<any>> = Omit<
  UseMutationOptions<Awaited<ReturnType<Fn>>, AxiosError, Parameters<Fn>[0]>,
  "mutationFn"
>;
