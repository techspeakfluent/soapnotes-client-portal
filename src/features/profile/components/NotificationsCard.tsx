import { Box, Flex, Skeleton, Stack, Switch, Text } from "@chakra-ui/react";
import { ErrorState, SectionCard } from "@/components/ui";
import type { INotificationPreferences } from "@/shared/interface/portal";
import { useGetPreferences, useUpdatePreferences } from "../api/query";

const OPTIONS: Array<{
  key: keyof INotificationPreferences;
  label: string;
  description: string;
}> = [
  {
    key: "session_reminders",
    label: "Session reminders",
    description: "An email the day before each session.",
  },
  {
    key: "invoice_emails",
    label: "New invoices",
    description: "An email when your practice sends you an invoice.",
  },
  {
    key: "payment_receipts",
    label: "Payment receipts",
    description: "A receipt by email each time you pay.",
  },
  {
    key: "marketing_emails",
    label: "News from your practice",
    description: "Occasional updates, workshops and offers.",
  },
];

export function NotificationsCard() {
  const preferences = useGetPreferences();
  const update = useUpdatePreferences();
  const values = preferences.data?.data;

  return (
    <SectionCard
      title="Email notifications"
      subtitle="Choose what your practice emails you about."
    >
      {preferences.isPending ? (
        <Stack gap="1rem">
          {OPTIONS.map((o) => (
            <Skeleton key={o.key} h="2.75rem" />
          ))}
        </Stack>
      ) : preferences.error || !values ? (
        <ErrorState
          error={preferences.error}
          title="We couldn't load your preferences"
          onRetry={() => preferences.refetch()}
          isRetrying={preferences.isRefetching}
        />
      ) : (
        <Stack gap="0">
          {OPTIONS.map((option, i) => (
            <Switch.Root
              key={option.key}
              checked={values[option.key]}
              onCheckedChange={(e) =>
                update.mutate({ [option.key]: e.checked })
              }
              colorPalette="primary"
              w="100%"
              py="0.75rem"
              borderTopWidth={i === 0 ? 0 : "1px"}
              borderColor="gray.50"
              cursor="pointer"
            >
              <Switch.HiddenInput />
              <Flex w="100%" align="center" justify="space-between" gap="1rem">
                <Box minW={0}>
                  <Switch.Label textStyle="small-medium" color="gray.500">
                    {option.label}
                  </Switch.Label>
                  <Text textStyle="tiny-regular" color="gray.300">
                    {option.description}
                  </Text>
                </Box>
                <Switch.Control flexShrink={0}>
                  <Switch.Thumb />
                </Switch.Control>
              </Flex>
            </Switch.Root>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
