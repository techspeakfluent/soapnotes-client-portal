import {
  getInvoiceDetail,
  invoiceListQuery,
  payInvoice as mockPayInvoice,
} from "@/mocks/handlers/invoices";
import { mockListResponse, mockResponse } from "@/mocks/mock-response";
import { db } from "@/mocks/store";
import type {
  IInvoiceFilter,
  IPayInvoicePayload,
} from "@/shared/interface/portal";

// Real endpoint: GET /client-portal/invoices (docs/api-needed.md).
export const getMyInvoices = async (filter: IInvoiceFilter) =>
  mockListResponse(() => db.invoices, invoiceListQuery(filter));

// Real endpoint: GET /client-portal/invoices/:id (docs/api-needed.md).
export const getMyInvoice = async (id: string) =>
  mockResponse(() => getInvoiceDetail(id));

// Real endpoint: POST /client-portal/invoices/:id/pay (docs/api-needed.md).
export const payInvoice = async (payload: IPayInvoicePayload) =>
  mockResponse(() => mockPayInvoice(payload), "Payment received");
