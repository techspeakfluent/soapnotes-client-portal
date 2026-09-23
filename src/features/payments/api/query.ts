import type { QueryConfigType } from "@/lib/react-query";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import type { IPageFilter } from "@/shared/interface/portal";
import {
  addPaymentMethod,
  getPaymentHistory,
  getPaymentMethods,
  removePaymentMethod,
  setDefaultPaymentMethod,
} from "./service";

export const useGetPaymentMethods = (
  config?: QueryConfigType<typeof getPaymentMethods>,
) =>
  useQuery({
    queryKey: [customQueryKey.payments.methods],
    queryFn: getPaymentMethods,
    ...config,
  });

export const useGetPaymentHistory = (
  filter: IPageFilter,
  config?: QueryConfigType<typeof getPaymentHistory>,
) =>
  useQuery({
    queryKey: [customQueryKey.payments.history, filter],
    queryFn: () => getPaymentHistory(filter),
    placeholderData: keepPreviousData,
    ...config,
  });

export const useAddPaymentMethod = () =>
  useMutation({
    mutationFn: addPaymentMethod,
    meta: {
      successMessage: "Card saved",
      errorMessage: "We couldn't save that card. Please try again.",
      invalidatesQueryKeys: [[customQueryKey.payments.methods]],
    },
  });

export const useRemovePaymentMethod = () =>
  useMutation({
    mutationFn: removePaymentMethod,
    meta: {
      successMessage: "Card removed",
      errorMessage: "We couldn't remove that card. Please try again.",
      invalidatesQueryKeys: [[customQueryKey.payments.methods]],
    },
  });

export const useSetDefaultPaymentMethod = () =>
  useMutation({
    mutationFn: setDefaultPaymentMethod,
    meta: {
      successMessage: "Default card updated",
      errorMessage: "We couldn't change your default card. Please try again.",
      invalidatesQueryKeys: [[customQueryKey.payments.methods]],
    },
  });
