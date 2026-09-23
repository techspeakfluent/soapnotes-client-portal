import {
  Box,
  Button,
  Center,
  Flex,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { CheckCircle, PlusIcon, TrashIcon, Wallet } from "@/components/icons";
import { ActionMenu, type TableAction } from "@/components/table";
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  SectionCard,
  StatusChip,
} from "@/components/ui";
import type { IPortalPaymentMethod } from "@/shared/interface/portal";
import { describeCard, formatExpiry, isCardExpired } from "@/utils/card";
import {
  useGetPaymentMethods,
  useRemovePaymentMethod,
  useSetDefaultPaymentMethod,
} from "../api/query";
import { AddCardDialog } from "./AddCardDialog";

const BRAND_CODES: Record<string, string> = {
  visa: "VISA",
  mastercard: "MC",
  amex: "AMEX",
  discover: "DISC",
};

function CardBrandTile({ brand }: { brand: string }) {
  return (
    <Center
      w="3rem"
      h="2rem"
      borderRadius="0.375rem"
      bg="gray.50"
      borderWidth="1px"
      borderColor="gray.75"
      flexShrink={0}
      aria-hidden
    >
      <Text
        textStyle="tiny-bold"
        color="gray.400"
        textTransform="uppercase"
        letterSpacing="0.02em"
      >
        {BRAND_CODES[brand] ?? "CARD"}
      </Text>
    </Center>
  );
}

export function SavedCardsCard() {
  const methods = useGetPaymentMethods();
  const setDefault = useSetDefaultPaymentMethod();
  const remove = useRemovePaymentMethod();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<IPortalPaymentMethod | null>(null);

  const actions = useMemo<TableAction<IPortalPaymentMethod>[]>(
    () => [
      {
        label: "Make default",
        value: "default",
        icon: <CheckCircle boxSize="1rem" />,
        show: (m) => !m.is_default && !isCardExpired(m),
        onClick: (m) => setDefault.mutateAsync(m.id).then(() => undefined),
      },
      {
        label: "Remove card",
        value: "remove",
        icon: <TrashIcon boxSize="1rem" />,
        variant: "destructive",
        onClick: (m) => setRemoving(m),
      },
    ],
    [setDefault],
  );

  const list = methods.data?.data ?? [];
  const addButton = (
    <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
      <PlusIcon boxSize="0.875rem" />
      Add card
    </Button>
  );

  return (
    <SectionCard
      title="Saved cards"
      subtitle="Choose one when you pay an invoice."
      action={list.length > 0 ? addButton : undefined}
    >
      {methods.isPending ? (
        <Stack gap="0.75rem">
          <Skeleton h="3.5rem" borderRadius="0.625rem" />
          <Skeleton h="3.5rem" borderRadius="0.625rem" />
        </Stack>
      ) : methods.error ? (
        <ErrorState
          error={methods.error}
          title="We couldn't load your cards"
          onRetry={() => methods.refetch()}
          isRetrying={methods.isRefetching}
        />
      ) : list.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No saved cards"
          description="Save a card to pay invoices faster. You won't be charged until you pay."
          action={<Box mt="0.5rem">{addButton}</Box>}
        />
      ) : (
        <Stack as="ul" gap="0.5rem" listStyleType="none" m="0" p="0">
          {list.map((method) => {
            const expired = isCardExpired(method);
            return (
              <Flex
                as="li"
                key={method.id}
                align="center"
                gap="0.75rem"
                px="0.75rem"
                py="0.5rem"
                borderWidth="1px"
                borderColor="gray.50"
                borderRadius="0.625rem"
                bg={expired ? "gray.25" : "white"}
              >
                <CardBrandTile brand={method.card.brand} />
                <Box flex="1" minW={0}>
                  <Flex align="center" gap="0.5rem" wrap="wrap">
                    <Text textStyle="small-semibold" color="gray.500">
                      {describeCard(method.card)}
                    </Text>
                    {method.is_default && (
                      <StatusChip tone="info" label="Default" />
                    )}
                  </Flex>
                  <Text
                    textStyle="tiny-regular"
                    color={expired ? "error.300" : "gray.300"}
                  >
                    {expired ? "Expired" : "Expires"} {formatExpiry(method)}
                  </Text>
                </Box>
                <ActionMenu
                  row={method}
                  actions={actions}
                  label={describeCard(method.card)}
                />
              </Flex>
            );
          })}
        </Stack>
      )}

      <AddCardDialog open={adding} onClose={() => setAdding(false)} />
      <ConfirmDialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        title="Remove this card?"
        description={
          removing
            ? `${describeCard(removing.card)} will be removed from your account. To pay with it again you'll need to re-enter its details.${
                removing.is_default
                  ? " Another saved card will become your default."
                  : ""
              }`
            : ""
        }
        confirmLabel="Remove card"
        isPending={remove.isPending}
        onConfirm={() =>
          removing &&
          remove.mutate(removing.id, { onSuccess: () => setRemoving(null) })
        }
      />
    </SectionCard>
  );
}
