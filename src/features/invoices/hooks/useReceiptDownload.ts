import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toaster } from "@/components/ui";
import { useCurrentClient } from "@/features/client/hooks/useCurrentClient";
import { getFullName, getPrimaryEmail } from "@/utils/client";
import { invoiceDetailQuery } from "../api/query";

const saveBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  // Give the browser a moment to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export function useReceiptDownload() {
  const client = useCurrentClient();
  const queryClient = useQueryClient();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const download = async (invoiceId: string) => {
    setPendingId(invoiceId);
    try {
      const [{ data: invoice }, { renderInvoicePdf }] = await Promise.all([
        // The list rows lack line items and payments, so use the detail.
        queryClient.fetchQuery(invoiceDetailQuery(invoiceId)),
        import("../components/receipt/render"),
      ]);
      const blob = await renderInvoicePdf({
        invoice,
        practiceName: client.organization.name,
        clientName: getFullName(client),
        clientEmail: getPrimaryEmail(client),
      });
      const kind = Number(invoice.amount_due ?? 0) <= 0 ? "receipt" : "invoice";
      saveBlob(blob, `${kind}-${invoice.invoice_number}.pdf`);
    } catch {
      toaster.create({
        type: "error",
        description: "We couldn't create the PDF. Please try again.",
      });
    } finally {
      setPendingId(null);
    }
  };

  return { download, pendingId };
}
