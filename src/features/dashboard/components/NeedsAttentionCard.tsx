import {
  Box,
  Button,
  Center,
  Flex,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  ArrowSquareOut,
  CheckCircle,
  ClipboardTextIcon,
  FileTextIcon,
  WarningCircle,
} from "@/components/icons";
import { EmptyState, SectionCard } from "@/components/ui";
import { RouteConstants } from "@/shared/constants/routes";
import type {
  ActionItemType,
  IActionItem,
  IOutstandingBalance,
} from "@/shared/interface/portal";
import { formatDate, formatRelativeDays } from "@/utils/format-date";
import { formatMoney } from "@/utils/format-money";

const VISUAL: Record<
  ActionItemType,
  { icon: typeof FileTextIcon; bg: string; color: string }
> = {
  invoice_overdue: { icon: WarningCircle, bg: "error.50", color: "error.300" },
  invoice_unpaid: {
    icon: FileTextIcon,
    bg: "warning.50",
    color: "warning.700",
  },
  form_pending: { icon: ClipboardTextIcon, bg: "info.50", color: "info.500" },
};

const describeDue = (item: IActionItem) => {
  if (!item.due_date)
    return item.type === "form_pending" ? "Form to complete" : "Unpaid";
  if (item.type === "invoice_overdue")
    return `Overdue since ${formatDate(item.due_date)}`;
  return `Due ${formatDate(item.due_date)} · ${formatRelativeDays(item.due_date)}`;
};

function ActionButton({ item }: { item: IActionItem }) {
  const buttonProps = {
    size: "md",
    w: { base: "100%", sm: "auto" },
    flexShrink: 0,
  } as const;

  if (item.type === "form_pending" && item.form_url) {
    return (
      <Button asChild variant="outline" {...buttonProps}>
        <a href={item.form_url} target="_blank" rel="noopener noreferrer">
          Complete form
          <ArrowSquareOut boxSize="0.875rem" />
          <Box as="span" srOnly>
            (opens in a new tab)
          </Box>
        </a>
      </Button>
    );
  }
  if (item.invoice_id) {
    return (
      <Button
        asChild
        variant={item.type === "invoice_overdue" ? "primary" : "outline"}
        {...buttonProps}
      >
        <Link
          to={RouteConstants.invoices.details.generate(
            { id: item.invoice_id },
            { pay: 1 },
          )}
        >
          Pay
          <Box as="span" srOnly>
            {` ${item.title}`}
          </Box>
        </Link>
      </Button>
    );
  }
  return null;
}

export function NeedsAttentionSkeleton() {
  return (
    <SectionCard title="Needs your attention">
      <Stack gap="1rem">
        {Array.from({ length: 3 }, (_, i) => (
          <Flex key={i} gap="0.75rem" align="center">
            <Skeleton boxSize="2.25rem" borderRadius="0.5rem" flexShrink={0} />
            <Stack gap="0.375rem" flex="1">
              <Skeleton h="1rem" w="55%" />
              <Skeleton h="0.875rem" w="40%" />
            </Stack>
          </Flex>
        ))}
      </Stack>
    </SectionCard>
  );
}

const MAX_ITEMS = 3;

interface NeedsAttentionCardProps {
  items: IActionItem[];
  balances: IOutstandingBalance[];
  payTarget: string | null;
}

function OutstandingSummary({
  balances,
  payTarget,
}: Omit<NeedsAttentionCardProps, "items">) {
  if (balances.length === 0 || !payTarget) return null;
  const count = balances.reduce((sum, b) => sum + b.invoice_count, 0);
  return (
    <Flex
      direction={{ base: "column", sm: "row" }}
      align={{ base: "stretch", sm: "center" }}
      justify="space-between"
      gap="0.75rem"
      bg="gray.25"
      borderRadius="0.75rem"
      p="1rem"
      mb="0.5rem"
    >
      <Box minW={0}>
        <Text textStyle="tiny-regular" color="gray.300">
          Outstanding across {count} {count === 1 ? "invoice" : "invoices"}
        </Text>
        {balances.map((b) => (
          <Text
            key={b.currency_code}
            textStyle="h3-semibold"
            color="gray.500"
            fontVariantNumeric="tabular-nums"
          >
            {formatMoney(b.amount_due, b.currency_code)}
          </Text>
        ))}
      </Box>
      <Button asChild variant="primary" flexShrink={0}>
        <Link to={payTarget}>{count === 1 ? "Pay now" : "Review and pay"}</Link>
      </Button>
    </Flex>
  );
}

export function NeedsAttentionCard({
  items,
  balances,
  payTarget,
}: NeedsAttentionCardProps) {
  if (items.length === 0) {
    return (
      <SectionCard title="Needs your attention">
        <EmptyState
          icon={CheckCircle}
          title="You're all caught up"
          description="Unpaid invoices and forms your practice needs from you will show up here."
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Needs your attention"
      subtitle={
        items.length === 1 ? "1 thing to do" : `${items.length} things to do`
      }
      footer={
        items.length > MAX_ITEMS ? (
          <Button asChild variant="ghost" size="sm" px="0.5rem">
            <Link
              to={RouteConstants.invoices.list.generate(
                {},
                { status: "UNPAID" },
              )}
            >
              See all {items.length}
            </Link>
          </Button>
        ) : undefined
      }
    >
      <OutstandingSummary balances={balances} payTarget={payTarget} />
      <Stack as="ul" gap="0" listStyleType="none" m="0" p="0">
        {items.slice(0, MAX_ITEMS).map((item, index) => {
          const visual = VISUAL[item.type];
          const Icon = visual.icon;
          return (
            <Flex
              as="li"
              key={item.id}
              gap="0.75rem"
              py="0.75rem"
              borderTopWidth={index === 0 ? "0" : "1px"}
              borderColor="gray.50"
              direction={{ base: "column", sm: "row" }}
              align={{ base: "stretch", sm: "center" }}
            >
              <Flex gap="0.75rem" align="flex-start" flex="1" minW={0}>
                <Center
                  boxSize="2.25rem"
                  borderRadius="0.5rem"
                  bg={visual.bg}
                  flexShrink={0}
                  aria-hidden
                >
                  <Icon boxSize="1.125rem" color={visual.color} />
                </Center>
                <Box flex="1" minW={0}>
                  <Flex justify="space-between" gap="0.75rem" align="baseline">
                    <Text
                      textStyle="small-semibold"
                      color="gray.500"
                      minW={0}
                      lineClamp={2}
                    >
                      {item.title}
                    </Text>
                    {item.amount_due != null && (
                      <Text
                        textStyle="small-semibold"
                        color="gray.500"
                        fontVariantNumeric="tabular-nums"
                        flexShrink={0}
                      >
                        {formatMoney(item.amount_due, item.currency_code)}
                      </Text>
                    )}
                  </Flex>
                  <Text
                    textStyle="tiny-regular"
                    color={
                      item.type === "invoice_overdue" ? "error.300" : "gray.300"
                    }
                  >
                    {describeDue(item)}
                  </Text>
                </Box>
              </Flex>
              <ActionButton item={item} />
            </Flex>
          );
        })}
      </Stack>
    </SectionCard>
  );
}
