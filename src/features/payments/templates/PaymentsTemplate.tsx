import { Stack } from "@chakra-ui/react";
import { PageHeader } from "@/components/ui";
import { PaymentHistory } from "../components/PaymentHistory";
import { SavedCardsCard } from "../components/SavedCardsCard";

export function PaymentsTemplate() {
  return (
    <Stack gap={{ base: "1rem", md: "1.5rem" }}>
      <PageHeader
        title="Payments"
        description="Your saved cards and everything you've paid."
      />
      <Stack gap="1rem">
        <SavedCardsCard />
        <PaymentHistory />
      </Stack>
    </Stack>
  );
}
