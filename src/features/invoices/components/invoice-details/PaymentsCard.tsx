import { Flex, Stack, Text } from "@chakra-ui/react";
import { Money } from "@/components/icons";
import { EmptyState, SectionCard, StatusChip } from "@/components/ui";
import type { IPortalInvoiceDetail } from "@/shared/interface/portal";
import { formatDate } from "@/utils/format-date";
import { formatMoney } from "@/utils/format-money";
import { PAYMENT_METHOD_LABELS } from "../../constants";

export function PaymentsCard({ invoice }: { invoice: IPortalInvoiceDetail }) {
  return (
    <SectionCard title="Payments">
      {invoice.payments.length === 0 ? (
        <EmptyState
          icon={Money}
          title="No payments yet"
          description="Payments on this invoice will be listed here."
          py="0.5rem"
        />
      ) : (
        <Stack as="ul" gap="0" listStyleType="none" m="0" p="0">
          {invoice.payments.map((payment, i) => {
            const isRefund = payment.transaction_type === "REFUND";
            return (
              <Flex
                as="li"
                key={payment.id}
                justify="space-between"
                align="center"
                gap="1rem"
                py="0.75rem"
                borderTopWidth={i === 0 ? 0 : "1px"}
                borderColor="gray.50"
              >
                <Stack gap="0.125rem" minW={0}>
                  <Text textStyle="small-medium" color="gray.500">
                    {isRefund
                      ? "Refund"
                      : (PAYMENT_METHOD_LABELS[payment.payment_method] ??
                        "Payment")}
                  </Text>
                  <Text textStyle="tiny-regular" color="gray.300">
                    {formatDate(payment.transaction_date)}
                  </Text>
                </Stack>
                <Stack gap="0.25rem" align="flex-end" flexShrink={0}>
                  <Text
                    textStyle="small-semibold"
                    color="gray.500"
                    fontVariantNumeric="tabular-nums"
                  >
                    {formatMoney(
                      payment.allocated_amount,
                      payment.currency_code,
                    )}
                  </Text>
                  <StatusChip status={payment.status} />
                </Stack>
              </Flex>
            );
          })}
        </Stack>
      )}
    </SectionCard>
  );
}
