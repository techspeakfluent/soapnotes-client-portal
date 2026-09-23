import { Button, Flex, Stack } from "@chakra-ui/react";
import {
  ErrorState,
  CustomSelect,
  PageHeader,
  SearchInput,
  SectionCard,
} from "@/components/ui";
import { InvoicesTable } from "../components/all-invoices/InvoicesTable";
import { INVOICE_STATUS_FILTER_OPTIONS } from "../constants";
import { useInvoiceList } from "../hooks/useInvoiceList";

export function InvoicesTemplate() {
  const list = useInvoiceList();

  return (
    <Stack gap={{ base: "1rem", md: "1.5rem" }}>
      <PageHeader
        title="Invoices"
        description="Everything your practice has billed you, and what's still to pay."
      />

      <Flex
        direction={{ base: "column", md: "row" }}
        gap="0.75rem"
        align={{ base: "stretch", md: "center" }}
      >
        <SearchInput
          label="Search invoices"
          placeholder="Search by number or service"
          value={list.search}
          onSearch={list.setSearch}
        />
        <CustomSelect
          label="Filter by status"
          value={list.status}
          options={INVOICE_STATUS_FILTER_OPTIONS}
          onChange={list.setStatus}
        />
        {list.hasFilters && (
          <Button variant="ghost" onClick={list.clearFilters}>
            Clear filters
          </Button>
        )}
      </Flex>

      {list.error && !list.isPending && list.invoices.length === 0 ? (
        <SectionCard>
          <ErrorState
            error={list.error}
            title="We couldn't load your invoices"
            onRetry={list.retry}
            isRetrying={list.isRetrying}
          />
        </SectionCard>
      ) : (
        <InvoicesTable list={list} />
      )}
    </Stack>
  );
}
