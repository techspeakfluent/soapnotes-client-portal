import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DownloadSimple, EyeIcon, Money } from "@/components/icons";
import type { TableAction } from "@/components/table";
import { RouteConstants } from "@/shared/constants/routes";
import type { IPortalInvoice } from "@/shared/interface/portal";
import { isInvoiceOpen } from "@/utils/invoice";
import { useReceiptDownload } from "./useReceiptDownload";

export function useInvoiceActions() {
  const navigate = useNavigate();
  const { download } = useReceiptDownload();
  const [payingInvoice, setPayingInvoice] = useState<IPortalInvoice | null>(
    null,
  );

  const actions = useMemo<TableAction<IPortalInvoice>[]>(
    () => [
      {
        label: "View invoice",
        value: "view",
        icon: <EyeIcon boxSize="1rem" />,
        onClick: (invoice) =>
          navigate(
            RouteConstants.invoices.details.generate({ id: invoice.id }),
          ),
      },
      {
        label: "Download PDF",
        value: "download",
        icon: <DownloadSimple boxSize="1rem" />,
        onClick: (invoice) => download(invoice.id),
      },
      {
        label: "Pay now",
        value: "pay",
        icon: <Money boxSize="1rem" />,
        show: isInvoiceOpen,
        onClick: (invoice) => setPayingInvoice(invoice),
      },
    ],
    [navigate, download],
  );

  return {
    actions,
    payingInvoice,
    closePay: () => setPayingInvoice(null),
  };
}
