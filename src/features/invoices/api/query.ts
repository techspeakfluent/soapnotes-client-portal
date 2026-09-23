import type { QueryConfigType } from "@/lib/react-query";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import type { IInvoiceFilter } from "@/shared/interface/portal";
import { getMyInvoice, getMyInvoices, payInvoice } from "./service";

export const useGetMyInvoices = (
  filter: IInvoiceFilter,
  config?: QueryConfigType<typeof getMyInvoices>,
) =>
  useQuery({
    queryKey: [customQueryKey.invoices.list, filter],
    queryFn: () => getMyInvoices(filter),
    placeholderData: keepPreviousData,
    ...config,
  });

export const invoiceDetailQuery = (id: string) => ({
  queryKey: [customQueryKey.invoices.detail, id],
  queryFn: () => getMyInvoice(id),
});

export const useGetMyInvoice = (
  id: string,
  config?: QueryConfigType<typeof getMyInvoice>,
) => useQuery({ ...invoiceDetailQuery(id), enabled: !!id, ...config });

export const usePayInvoice = () =>
  useMutation({
    mutationFn: payInvoice,
    meta: {
      successMessage: "Payment received — thank you",
      errorMessage: "Your payment didn't go through. You haven't been charged.",
      invalidatesQueryKeys: [
        [customQueryKey.invoices.list],
        [customQueryKey.invoices.detail],
        [customQueryKey.dashboard.summary],
        [customQueryKey.client.activity],
        [customQueryKey.payments.history],
        [customQueryKey.payments.methods],
      ],
    },
  });
