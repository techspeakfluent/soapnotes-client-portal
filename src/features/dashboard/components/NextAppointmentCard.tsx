import { Box, Button, Flex, Skeleton, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowSquareOut,
  CalendarBlank,
  ClockIcon,
  MapPinLineIcon,
  MonitorIcon,
} from "@/components/icons";
import {
  EmptyState,
  PersonAvatar,
  SectionCard,
  StatusChip,
} from "@/components/ui";
import { RouteConstants } from "@/shared/constants/routes";
import type { IPortalBooking } from "@/shared/interface/portal";
import { getBookingStart, isVirtualBooking } from "@/utils/booking";
import { getFullName } from "@/utils/client";
import {
  MONTHS,
  formatRelativeDays,
  formatTimeRange,
  formatWeekdayDate,
} from "@/utils/format-date";

function DateBlock({ booking }: { booking: IPortalBooking }) {
  const start = getBookingStart(booking);
  if (!start) return null;
  return (
    <Stack
      gap="0"
      align="center"
      justify="center"
      w="3.5rem"
      h="3.75rem"
      flexShrink={0}
      borderRadius="0.75rem"
      bg="primary.50"
      color="primary.400"
      aria-hidden
    >
      <Text textStyle="tiny-semibold" textTransform="uppercase">
        {MONTHS[start.getMonth()]}
      </Text>
      <Text textStyle="h3-semibold" fontVariantNumeric="tabular-nums">
        {start.getDate()}
      </Text>
    </Stack>
  );
}

function DetailLine({
  icon: Icon,
  children,
}: {
  icon: typeof ClockIcon;
  children: ReactNode;
}) {
  return (
    <Flex gap="0.5rem" align="flex-start" minW={0}>
      <Icon
        boxSize="1rem"
        color="gray.200"
        mt="0.1875rem"
        flexShrink={0}
        aria-hidden
      />
      <Text
        textStyle="small-regular"
        color="gray.400"
        minW={0}
        wordBreak="break-word"
      >
        {children}
      </Text>
    </Flex>
  );
}

const bookingsLink = (
  <Button asChild variant="ghost" size="sm" px="0.5rem">
    <Link to={RouteConstants.bookings.list.path}>All bookings</Link>
  </Button>
);

export function NextAppointmentSkeleton() {
  return (
    <SectionCard title="Next appointment">
      <Flex gap="1rem">
        <Skeleton
          w="3.5rem"
          h="3.75rem"
          borderRadius="0.75rem"
          flexShrink={0}
        />
        <Stack gap="0.5rem" flex="1">
          <Skeleton h="1.25rem" w="70%" />
          <Skeleton h="1rem" w="50%" />
          <Skeleton h="1rem" w="60%" />
          <Skeleton h="1rem" w="40%" />
        </Stack>
      </Flex>
    </SectionCard>
  );
}

export function NextAppointmentCard({
  booking,
}: {
  booking: IPortalBooking | null;
}) {
  if (!booking) {
    return (
      <SectionCard title="Next appointment">
        <EmptyState
          icon={CalendarBlank}
          title="No upcoming sessions"
          description="When your practice books your next session, it will show here with the time and how to join."
        />
      </SectionCard>
    );
  }

  const provider = getFullName(booking.slp);
  const virtual = isVirtualBooking(booking);

  return (
    <SectionCard title="Next appointment" action={bookingsLink}>
      <Flex gap={{ base: "0.75rem", md: "1rem" }} align="flex-start">
        <DateBlock booking={booking} />
        <Stack gap="0.5rem" flex="1" minW={0}>
          <Flex
            gap="0.5rem"
            align="flex-start"
            justify="space-between"
            wrap="wrap"
          >
            <Text
              textStyle="default-semibold"
              color="gray.500"
              minW={0}
              lineClamp={2}
            >
              {booking.service.name}
            </Text>
            <StatusChip status={booking.status} />
          </Flex>

          <DetailLine icon={CalendarBlank}>
            {formatWeekdayDate(booking.start_time)}
            <Box as="span" color="primary.400" textStyle="small-medium">
              {` · ${formatRelativeDays(booking.start_time)}`}
            </Box>
          </DetailLine>
          <DetailLine icon={ClockIcon}>
            {formatTimeRange(booking.start_time, booking.end_time)}
          </DetailLine>
          <DetailLine icon={virtual ? MonitorIcon : MapPinLineIcon}>
            {virtual
              ? "Online session"
              : (booking.location ?? "Location to be confirmed")}
          </DetailLine>

          <Flex align="center" gap="0.5rem" pt="0.25rem" minW={0}>
            <PersonAvatar
              name={provider}
              src={booking.slp.avatar_url}
              size="xs"
            />
            <Text textStyle="small-medium" color="gray.400" truncate>
              {provider}
            </Text>
          </Flex>
        </Stack>
      </Flex>

      {virtual && booking.meet_link && (
        <Button
          asChild
          variant="primary"
          w={{ base: "100%", sm: "auto" }}
          mt="1rem"
        >
          <a href={booking.meet_link} target="_blank" rel="noopener noreferrer">
            Join session
            <ArrowSquareOut boxSize="1rem" />
            <Box as="span" srOnly>
              (opens in a new tab)
            </Box>
          </a>
        </Button>
      )}
    </SectionCard>
  );
}
