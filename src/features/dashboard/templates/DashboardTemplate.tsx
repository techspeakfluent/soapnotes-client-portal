import { Grid, Stack } from "@chakra-ui/react";
import { ErrorState, PageHeader, SectionCard } from "@/components/ui";
import { useCurrentClient } from "@/features/client/hooks/useCurrentClient";
import {
  NeedsAttentionCard,
  NeedsAttentionSkeleton,
} from "../components/NeedsAttentionCard";
import {
  NextAppointmentCard,
  NextAppointmentSkeleton,
} from "../components/NextAppointmentCard";
import { StatTiles, StatTilesSkeleton } from "../components/StatTiles";
import { useDashboard } from "../hooks/useDashboard";

export function DashboardTemplate() {
  const client = useCurrentClient();
  const {
    dashboard,
    balances,
    payTarget,
    isPending,
    error,
    retry,
    isRetrying,
  } = useDashboard();

  return (
    <Stack gap={{ base: "1rem", md: "1.5rem" }}>
      <PageHeader
        title={`Welcome back, ${client.first_name}`}
        description={`Your sessions and billing with ${client.organization.name}.`}
      />

      {error && !isPending ? (
        <SectionCard>
          <ErrorState
            error={error}
            title="We couldn't load your summary"
            onRetry={retry}
            isRetrying={isRetrying}
          />
        </SectionCard>
      ) : (
        <>
          {dashboard ? (
            <StatTiles
              metrics={dashboard.metrics}
              currencyCode={client.organization.currency_code}
            />
          ) : (
            <StatTilesSkeleton />
          )}
          <Grid
            templateColumns={{
              base: "minmax(0, 1fr)",
              lg: "repeat(2, minmax(0, 1fr))",
            }}
            gap="1rem"
            alignItems="start"
          >
            {dashboard ? (
              <NextAppointmentCard booking={dashboard.next_booking} />
            ) : (
              <NextAppointmentSkeleton />
            )}
            {dashboard ? (
              <NeedsAttentionCard
                items={dashboard.action_items}
                balances={balances}
                payTarget={payTarget}
              />
            ) : (
              <NeedsAttentionSkeleton />
            )}
          </Grid>
        </>
      )}
    </Stack>
  );
}
