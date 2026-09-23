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
  CalendarBlank,
  CheckCircle,
  ClipboardTextIcon,
  ClockIcon,
  Envelope,
  Money,
  User,
  XIcon,
} from "@/components/icons";
import { EmptyState, ErrorState, SectionCard } from "@/components/ui";
import { RouteConstants } from "@/shared/constants/routes";
import type { IPortalActivity } from "@/shared/interface/portal";
import { formatDateTime, formatTimeAgo } from "@/utils/format-date";
import { formatMoney } from "@/utils/format-money";
import { getStatusLabel } from "@/utils/status";
import { useActivityFeed } from "../hooks/useActivityFeed";

interface ActivityView {
  icon: typeof CalendarBlank;
  bg: string;
  color: string;
  title: string;
  detail?: string;
  to?: string;
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CREDIT_CARD: "by card",
  E_TRANSFER: "by e-Transfer",
  BANK_TRANSFER: "by bank transfer",
  CASH: "in cash",
  PAYPAL: "by PayPal",
};

const join = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" · ") || undefined;

// `details` keys follow the ones soapnotes' activity cards read.
function describe(activity: IPortalActivity): ActivityView {
  const d = activity.details ?? {};
  const money = (value: unknown) =>
    value != null
      ? formatMoney(value as number, d.currency_code as string)
      : null;
  const invoiceLink = d.invoice_id
    ? RouteConstants.invoices.details.generate({ id: String(d.invoice_id) })
    : undefined;

  switch (activity.activity_type) {
    case "invoice_sent":
    case "invoice_created":
      return {
        icon: Envelope,
        bg: "info.50",
        color: "info.500",
        title: d.invoice_number
          ? `Invoice ${d.invoice_number} sent`
          : "Invoice sent",
        detail: join(money(d.total_price ?? d.amount)),
        to: invoiceLink,
      };
    case "transaction_created":
      return {
        icon: Money,
        bg: "success.50",
        color: "success.400",
        title: "Payment received",
        detail: join(
          [money(d.amount), PAYMENT_METHOD_LABEL[String(d.payment_method)]]
            .filter(Boolean)
            .join(" "),
          d.invoice_number && `Invoice ${d.invoice_number}`,
        ),
      };
    case "package_refunded":
      return {
        icon: Money,
        bg: "gray.75",
        color: "gray.400",
        title: "Refund issued",
        detail: join(
          money(d.amount),
          d.invoice_number && `Invoice ${d.invoice_number}`,
        ),
      };
    case "booking_created":
    case "event_booked":
      return {
        icon: CalendarBlank,
        bg: "primary.50",
        color: "primary.400",
        title: "Session booked",
        detail: join(
          d.event as string,
          d.appointment && formatDateTime(d.appointment as string),
        ),
      };
    case "booking_rescheduled":
      return {
        icon: ClockIcon,
        bg: "primary.50",
        color: "primary.400",
        title: "Session rescheduled",
        detail: join(
          d.event as string,
          d.appointment && formatDateTime(d.appointment as string),
        ),
      };
    case "booking_cancelled":
      return {
        icon: XIcon,
        bg: "error.50",
        color: "error.300",
        title: "Session cancelled",
        detail: join(
          d.event as string,
          d.appointment && formatDateTime(d.appointment as string),
        ),
      };
    case "form_submitted":
      return {
        icon: ClipboardTextIcon,
        bg: "secondary.50",
        color: "secondary.400",
        title: "Form submitted",
        detail: (d.form_name ?? d.title) as string | undefined,
      };
    case "profile_updated":
      return {
        icon: User,
        bg: "gray.75",
        color: "gray.400",
        title: "Details updated",
      };
    case "package_created":
      return {
        icon: CheckCircle,
        bg: "success.50",
        color: "success.400",
        title: "Package purchased",
        detail: d.package_name as string | undefined,
      };
    default:
      return {
        icon: ClockIcon,
        bg: "gray.75",
        color: "gray.400",
        title: getStatusLabel(activity.activity_type ?? "Update"),
      };
  }
}

function ActivityRow({ activity }: { activity: IPortalActivity }) {
  const view = describe(activity);
  const Icon = view.icon;

  const content = (
    <>
      <Center
        boxSize="2rem"
        borderRadius="full"
        bg={view.bg}
        flexShrink={0}
        aria-hidden
      >
        <Icon boxSize="1rem" color={view.color} />
      </Center>
      <Box flex="1" minW={0}>
        <Text textStyle="small-medium" color="gray.500" lineClamp={2}>
          {view.title}
        </Text>
        {view.detail && (
          <Text
            textStyle="tiny-regular"
            color="gray.300"
            lineClamp={2}
            fontVariantNumeric="tabular-nums"
          >
            {view.detail}
          </Text>
        )}
      </Box>
      <Text
        asChild
        textStyle="tiny-regular"
        color="gray.200"
        flexShrink={0}
        whiteSpace="nowrap"
      >
        <time dateTime={activity.activity_date}>
          {formatTimeAgo(activity.activity_date)}
        </time>
      </Text>
    </>
  );

  const rowProps = {
    gap: "0.75rem",
    align: "flex-start",
    py: "0.625rem",
    px: "0.5rem",
    mx: "-0.5rem",
    borderRadius: "0.5rem",
    minW: 0,
  } as const;

  return (
    <Box as="li">
      {view.to ? (
        <Flex
          asChild
          {...rowProps}
          _hover={{ bg: "gray.25" }}
          transition="background-color 0.15s"
        >
          <Link to={view.to}>{content}</Link>
        </Flex>
      ) : (
        <Flex {...rowProps}>{content}</Flex>
      )}
    </Box>
  );
}

function ActivitySkeleton() {
  return (
    <Stack gap="1rem" aria-busy="true" aria-label="Loading activity">
      {Array.from({ length: 4 }, (_, i) => (
        <Flex key={i} gap="0.75rem" align="center">
          <Skeleton boxSize="2rem" borderRadius="full" flexShrink={0} />
          <Stack gap="0.375rem" flex="1">
            <Skeleton h="0.875rem" w="50%" />
            <Skeleton h="0.75rem" w="70%" />
          </Stack>
        </Flex>
      ))}
    </Stack>
  );
}

export function RecentActivityCard() {
  const feed = useActivityFeed();

  return (
    <SectionCard title="Recent activity">
      {feed.isPending ? (
        <ActivitySkeleton />
      ) : feed.error ? (
        <ErrorState
          error={feed.error}
          onRetry={feed.retry}
          isRetrying={feed.isRetrying}
        />
      ) : feed.activities.length === 0 ? (
        <EmptyState
          icon={ClockIcon}
          title="Nothing here yet"
          description="Invoices, payments and bookings will be listed here as they happen."
        />
      ) : (
        <>
          <Stack as="ul" gap="0" listStyleType="none" m="0" p="0">
            {feed.activities.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </Stack>
          {feed.hasMore && (
            <Button
              variant="outlineSecondary"
              w="100%"
              mt="0.75rem"
              onClick={feed.loadMore}
              loading={feed.isLoadingMore}
              loadingText="Loading"
            >
              Show more
            </Button>
          )}
        </>
      )}
    </SectionCard>
  );
}
