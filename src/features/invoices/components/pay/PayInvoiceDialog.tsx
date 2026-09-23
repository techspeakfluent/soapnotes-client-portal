import {
  Box,
  Checkbox,
  Flex,
  RadioGroup,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CustomModal, StatusChip } from "@/components/ui";
import { useGetPaymentMethods } from "@/features/payments/api/query";
import { CardEntryFields } from "@/features/payments/components/CardEntryFields";
import { useCardEntry } from "@/features/payments/hooks/useCardEntry";
import type { IPortalInvoice } from "@/shared/interface/portal";
import { describeCard, formatExpiry, isCardExpired } from "@/utils/card";
import { formatMoney } from "@/utils/format-money";
import { usePayInvoice } from "../../api/query";

const NEW_CARD = "new";

interface PayInvoiceDialogProps {
  invoice: IPortalInvoice | null;
  onClose: () => void;
}

export function PayInvoiceDialog({ invoice, onClose }: PayInvoiceDialogProps) {
  const open = !!invoice;
  const methods = useGetPaymentMethods();
  const pay = usePayInvoice();
  const entry = useCardEntry();
  const [choice, setChoice] = useState<string>("");
  const [saveCard, setSaveCard] = useState(true);

  const usable = (methods.data?.data ?? []).filter((m) => !isCardExpired(m));
  const expired = (methods.data?.data ?? []).filter((m) => isCardExpired(m));

  useEffect(() => {
    if (!open || methods.isPending) return;
    setChoice(usable[0]?.id ?? NEW_CARD);
    entry.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, methods.isPending]);

  if (!invoice) return null;

  const amount = formatMoney(invoice.amount_due, invoice.currency_code);
  const isNewCard = choice === NEW_CARD;
  const busy = pay.isPending || entry.isTokenising;

  const submit = async () => {
    const paymentMethodId = isNewCard ? await entry.tokenise() : choice;
    if (!paymentMethodId) return;
    pay.mutate(
      {
        invoice_id: invoice.id,
        payment_method_id: paymentMethodId,
        save_card: isNewCard && saveCard,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <CustomModal
      open={open}
      onClose={() => !busy && onClose()}
      title={`Pay invoice ${invoice.invoice_number}`}
      description="You'll be charged the full amount due."
      secondaryAction={{ text: "Cancel", onClick: onClose, disabled: busy }}
      primaryAction={{
        text: `Pay ${amount}`,
        onClick: submit,
        loading: busy,
        loadingText: "Processing payment",
        disabled: !choice,
      }}
    >
      <Stack gap="1.25rem">
        <Flex
          justify="space-between"
          align="center"
          bg="gray.25"
          borderRadius="0.75rem"
          px="1rem"
          py="0.75rem"
          gap="1rem"
        >
          <Text textStyle="small-regular" color="gray.300">
            Amount due
          </Text>
          <Text
            textStyle="h3-semibold"
            color="gray.500"
            fontVariantNumeric="tabular-nums"
          >
            {amount}
          </Text>
        </Flex>

        {methods.isPending ? (
          <Stack gap="0.5rem">
            <Skeleton h="3.25rem" borderRadius="0.625rem" />
            <Skeleton h="3.25rem" borderRadius="0.625rem" />
          </Stack>
        ) : (
          <RadioGroup.Root
            value={choice}
            onValueChange={(e) => setChoice(e.value ?? "")}
            aria-label="Pay with"
          >
            <Stack gap="0.5rem">
              <Text textStyle="small-medium" color="gray.400">
                Pay with
              </Text>
              {[...usable.map((m) => m.id), NEW_CARD].map((value) => {
                const method = usable.find((m) => m.id === value);
                const selected = choice === value;
                return (
                  <RadioGroup.Item
                    key={value}
                    value={value}
                    minH="3.25rem"
                    px="1rem"
                    borderWidth="1px"
                    borderRadius="0.625rem"
                    borderColor={selected ? "primary.300" : "gray.75"}
                    bg={selected ? "primary.25" : "white"}
                    cursor="pointer"
                    transition="border-color 0.15s, background-color 0.15s"
                  >
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText flex="1" minW={0}>
                      {method ? (
                        <Flex align="center" gap="0.5rem" wrap="wrap">
                          <Text textStyle="small-medium" color="gray.500">
                            {describeCard(method.card)}
                          </Text>
                          <Text textStyle="tiny-regular" color="gray.300">
                            Expires {formatExpiry(method)}
                          </Text>
                          {method.is_default && (
                            <StatusChip tone="info" label="Default" />
                          )}
                        </Flex>
                      ) : (
                        <Text textStyle="small-medium" color="gray.500">
                          Use a new card
                        </Text>
                      )}
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>
                );
              })}
              {expired.length > 0 && (
                <Text textStyle="tiny-regular" color="gray.300">
                  {expired.map((m) => describeCard(m.card)).join(", ")}{" "}
                  {expired.length === 1 ? "has" : "have"} expired and can't be
                  used.
                </Text>
              )}
            </Stack>
          </RadioGroup.Root>
        )}

        {isNewCard && (
          <Box>
            <CardEntryFields entry={entry} />
            <Checkbox.Root
              mt="0.75rem"
              checked={saveCard}
              onCheckedChange={(e) => setSaveCard(!!e.checked)}
              colorPalette="primary"
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label textStyle="small-regular" color="gray.400">
                Save this card for future payments
              </Checkbox.Label>
            </Checkbox.Root>
          </Box>
        )}
      </Stack>
    </CustomModal>
  );
}
