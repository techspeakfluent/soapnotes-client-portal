import { Box, Flex, type FlexProps } from "@chakra-ui/react";
import { getStatusLabel, getStatusTone, type StatusTone } from "@/utils/status";

const TONE_COLORS: Record<StatusTone, { bg: string; fg: string; dot: string }> =
  {
    success: { bg: "success.50", fg: "success.400", dot: "success.300" },
    warning: { bg: "warning.50", fg: "warning.800", dot: "warning.500" },
    error: { bg: "error.50", fg: "error.400", dot: "error.300" },
    info: { bg: "info.50", fg: "info.700", dot: "info.500" },
    neutral: { bg: "gray.75", fg: "gray.400", dot: "gray.200" },
  };

interface StatusChipProps extends Omit<FlexProps, "children"> {
  status?: string | null;
  label?: string;
  tone?: StatusTone;
}

export function StatusChip({ status, label, tone, ...rest }: StatusChipProps) {
  const colors = TONE_COLORS[tone ?? getStatusTone(status)];
  return (
    <Flex
      display="inline-flex"
      alignItems="center"
      gap="0.375rem"
      px="0.5rem"
      py="0.125rem"
      borderRadius="full"
      bg={colors.bg}
      color={colors.fg}
      textStyle="tiny-medium"
      whiteSpace="nowrap"
      flexShrink={0}
      {...rest}
    >
      <Box boxSize="0.375rem" borderRadius="full" bg={colors.dot} aria-hidden />
      {label ?? getStatusLabel(status)}
    </Flex>
  );
}
