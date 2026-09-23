import {
  Box,
  Center,
  Flex,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDotsIcon,
  CheckCircle,
  ClipboardTextIcon,
  Wallet,
} from "@/components/icons";
import { RouteConstants } from "@/shared/constants/routes";
import type { IDashboardMetrics } from "@/shared/interface/portal";
import { formatMoney } from "@/utils/format-money";

interface StatTileProps {
  title: string;
  value: string;
  hint?: string;
  icon: ComponentType<{ boxSize?: object | string; color?: string }>;
  iconColor: string;
  iconBg: string;
  to?: string;
}

function StatTile({
  title,
  value,
  hint,
  icon: Icon,
  iconColor,
  iconBg,
  to,
}: StatTileProps) {
  const body = (
    <>
      <Center
        boxSize={{ base: "2rem", md: "2.5rem" }}
        borderRadius="0.5rem"
        bg={iconBg}
        flexShrink={0}
        aria-hidden
      >
        <Icon boxSize={{ base: "1rem", md: "1.25rem" }} color={iconColor} />
      </Center>
      <Stack gap="0.125rem" flex={1} minW={0}>
        <Text textStyle="tiny-regular" color="gray.300" lineClamp={2}>
          {title}
        </Text>
        <Text
          textStyle={{ base: "default-semibold", md: "large-semibold" }}
          color="gray.500"
          fontVariantNumeric="tabular-nums"
          wordBreak="break-word"
        >
          {value}
        </Text>
        {hint && (
          <Text textStyle="tiny-regular" color="gray.200" lineClamp={1}>
            {hint}
          </Text>
        )}
      </Stack>
    </>
  );

  const tileProps = {
    bg: "white",
    border: "1px solid",
    borderColor: "gray.50",
    borderRadius: "0.75rem",
    p: { base: "0.75rem", md: "1rem" },
    gap: { base: "0.5rem", md: "0.75rem" },
    // Icon above the numbers on phones, so a long balance keeps its width.
    direction: { base: "column", md: "row" },
    align: { base: "flex-start", md: "center" },
    minW: 0,
  } as const;

  if (!to) return <Flex {...tileProps}>{body}</Flex>;
  return (
    <Flex
      asChild
      {...tileProps}
      _hover={{ borderColor: "primary.100" }}
      transition="border-color 0.15s"
    >
      <Link to={to}>{body}</Link>
    </Flex>
  );
}

export function StatTilesSkeleton() {
  return (
    <SimpleGrid
      columns={{ base: 2, lg: 4 }}
      gap={{ base: "0.75rem", md: "1rem" }}
    >
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton
          key={i}
          h={{ base: "5.5rem", md: "5.25rem" }}
          borderRadius="0.75rem"
        />
      ))}
    </SimpleGrid>
  );
}

interface StatTilesProps {
  metrics: IDashboardMetrics;
  currencyCode: string;
}

export function StatTiles({ metrics, currencyCode }: StatTilesProps) {
  const [primary, ...others] = metrics.outstanding;

  return (
    <Box as="section" aria-label="At a glance">
      <SimpleGrid
        columns={{ base: 2, lg: 4 }}
        gap={{ base: "0.75rem", md: "1rem" }}
      >
        <StatTile
          title="Upcoming sessions"
          value={String(metrics.upcoming_sessions)}
          icon={CalendarDotsIcon}
          iconColor="primary.400"
          iconBg="primary.50"
          to={RouteConstants.bookings.list.path}
        />
        <StatTile
          title="Sessions attended"
          value={String(metrics.attended_sessions)}
          icon={CheckCircle}
          iconColor="info.500"
          iconBg="info.50"
          to={RouteConstants.bookings.list.path}
        />
        <StatTile
          title="Outstanding balance"
          value={
            primary
              ? formatMoney(primary.amount_due, primary.currency_code)
              : formatMoney(0, currencyCode)
          }
          hint={
            others.length > 0
              ? `+ ${others.map((b) => formatMoney(b.amount_due, b.currency_code)).join(", ")}`
              : undefined
          }
          icon={Wallet}
          iconColor="warning.700"
          iconBg="warning.50"
          to={RouteConstants.invoices.list.generate({}, { status: "UNPAID" })}
        />
        <StatTile
          title="Package sessions left"
          value={String(metrics.package_sessions_remaining)}
          icon={ClipboardTextIcon}
          iconColor="secondary.400"
          iconBg="secondary.50"
        />
      </SimpleGrid>
    </Box>
  );
}
