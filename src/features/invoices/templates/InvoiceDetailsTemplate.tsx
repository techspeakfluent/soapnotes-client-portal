import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, DownloadSimple } from "@/components/icons";
import { ErrorState, SectionCard, StatusChip } from "@/components/ui";
import { useCurrentClient } from "@/features/client/hooks/useCurrentClient";
import { RouteConstants } from "@/shared/constants/routes";
import { formatDate } from "@/utils/format-date";
import { formatMoney } from "@/utils/format-money";
import {
  getInvoiceDisplayStatus,
  isInvoiceOpen,
  isInvoiceOverdue,
} from "@/utils/invoice";
import { useGetMyInvoice } from "../api/query";
import { LineItemsCard } from "../components/invoice-details/LineItemsCard";
import { PaymentsCard } from "../components/invoice-details/PaymentsCard";
import { PayInvoiceDialog } from "../components/pay/PayInvoiceDialog";
import { useReceiptDownload } from "../hooks/useReceiptDownload";

const backLink = (
  <Button
    asChild
    variant="ghost"
    size="sm"
    alignSelf="flex-start"
    px="0.5rem"
    ml="-0.5rem"
  >
    <Link to={RouteConstants.invoices.list.path}>
      <ArrowLeft boxSize="1rem" />
      All invoices
    </Link>
  </Button>
);

function DetailSkeleton() {
  return (
    <Stack gap="1rem" aria-busy="true" aria-label="Loading invoice">
      <Skeleton h="2.25rem" w="16rem" />
      <Skeleton h="1rem" w="12rem" />
      <Grid
        templateColumns={{ base: "1fr", lg: "minmax(0,2fr) minmax(0,1fr)" }}
        gap="1rem"
      >
        <Skeleton h="18rem" borderRadius="0.75rem" />
        <Skeleton h="12rem" borderRadius="0.75rem" />
      </Grid>
    </Stack>
  );
}

export function InvoiceDetailsTemplate() {
  const { id = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const client = useCurrentClient();
  const query = useGetMyInvoice(id);
  const { download, pendingId } = useReceiptDownload();
  const [payOpen, setPayOpen] = useState(false);
  const invoice = query.data?.data;

  // `?pay=1` (from the dashboard) opens the pay dialog straight away.
  useEffect(() => {
    if (!invoice || params.get("pay") !== "1") return;
    if (isInvoiceOpen(invoice)) setPayOpen(true);
    setParams(
      (prev) => {
        prev.delete("pay");
        return prev;
      },
      { replace: true },
    );
  }, [invoice, params, setParams]);

  if (query.isPending) return <DetailSkeleton />;
  if (query.error || !invoice) {
    return (
      <Stack gap="1rem">
        {backLink}
        <SectionCard>
          <ErrorState
            error={query.error}
            title="We couldn't load this invoice"
            onRetry={() => query.refetch()}
            isRetrying={query.isRefetching}
          />
        </SectionCard>
      </Stack>
    );
  }

  const open = isInvoiceOpen(invoice);
  const overdue = isInvoiceOverdue(invoice);
  const amountDue = formatMoney(invoice.amount_due, invoice.currency_code);
  const isDownloading = pendingId === invoice.id;

  return (
    <Stack
      gap={{ base: "1rem", md: "1.5rem" }}
      pb={open ? { base: "5rem", md: 0 } : 0}
    >
      {backLink}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        gap="0.75rem"
        align={{ md: "flex-end" }}
      >
        <Box minW={0}>
          <Flex align="center" gap="0.75rem" wrap="wrap">
            <Heading
              as="h1"
              textStyle={{ base: "h2-semibold", md: "h1-semibold" }}
              color="gray.500"
              wordBreak="break-word"
            >
              Invoice {invoice.invoice_number}
            </Heading>
            <StatusChip status={getInvoiceDisplayStatus(invoice)} />
          </Flex>
          <Text textStyle="small-regular" color="gray.300" mt="0.25rem">
            From {client.organization.name} · Issued{" "}
            {formatDate(invoice.invoice_date)} · Due{" "}
            {formatDate(invoice.due_date)}
          </Text>
        </Box>
        <Button
          variant="outlineSecondary"
          onClick={() => download(invoice.id)}
          loading={isDownloading}
          loadingText="Preparing PDF"
          w={{ base: "100%", md: "auto" }}
        >
          <DownloadSimple boxSize="1rem" />
          {open ? "Download invoice" : "Download receipt"}
        </Button>
      </Flex>

      <Grid
        templateColumns={{
          base: "minmax(0,1fr)",
          lg: "minmax(0,2fr) minmax(0,1fr)",
        }}
        gap="1rem"
        alignItems="start"
      >
        <LineItemsCard invoice={invoice} />
        <Stack gap="1rem" minW={0}>
          <SectionCard
            title="Amount due"
            display={{ base: "none", md: "block" }}
          >
            <Text
              textStyle="h1-semibold"
              color="gray.500"
              fontVariantNumeric="tabular-nums"
            >
              {amountDue}
            </Text>
            <Text
              textStyle="small-regular"
              color={overdue ? "error.300" : "gray.300"}
              mt="0.25rem"
            >
              {open
                ? overdue
                  ? `Overdue since ${formatDate(invoice.due_date)}`
                  : `Due ${formatDate(invoice.due_date)}`
                : "Nothing left to pay on this invoice."}
            </Text>
            {open && (
              <Button
                display={{ base: "none", md: "flex" }}
                variant="primary"
                w="100%"
                mt="1rem"
                onClick={() => setPayOpen(true)}
              >
                Pay {amountDue}
              </Button>
            )}
          </SectionCard>
          <PaymentsCard invoice={invoice} />
        </Stack>
      </Grid>

      {open && (
        <Box
          display={{ base: "block", md: "none" }}
          position="fixed"
          left="0"
          right="0"
          bottom="0"
          zIndex="10"
          bg="white"
          borderTopWidth="1px"
          borderColor="gray.50"
          px="1rem"
          pt="0.75rem"
          pb="calc(0.75rem + env(safe-area-inset-bottom))"
        >
          <Button variant="primary" w="100%" onClick={() => setPayOpen(true)}>
            Pay {amountDue}
          </Button>
        </Box>
      )}

      <PayInvoiceDialog
        invoice={payOpen ? invoice : null}
        onClose={() => setPayOpen(false)}
      />
    </Stack>
  );
}
