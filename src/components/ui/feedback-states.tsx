import { Button, Center, Stack, Text, type StackProps } from "@chakra-ui/react";
import type { ComponentType, ReactNode } from "react";
import { ArrowClockwise, WarningCircle } from "@/components/icons";
import { getErrorMessage } from "@/utils/handle-error";

interface EmptyStateProps extends StackProps {
  icon?: ComponentType<{ boxSize?: string; color?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  ...rest
}: EmptyStateProps) {
  return (
    <Stack align="center" textAlign="center" gap="0.5rem" py="1.5rem" {...rest}>
      {Icon && (
        <Center boxSize="2.5rem" borderRadius="full" bg="gray.50" mb="0.25rem">
          <Icon boxSize="1.25rem" color="gray.300" />
        </Center>
      )}
      <Text textStyle="small-semibold" color="gray.500">
        {title}
      </Text>
      {description && (
        <Text textStyle="small-regular" color="gray.300" maxW="24rem">
          {description}
        </Text>
      )}
      {action}
    </Stack>
  );
}

interface ErrorStateProps extends StackProps {
  error?: unknown;
  title?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  error,
  title = "This didn't load",
  onRetry,
  isRetrying,
  ...rest
}: ErrorStateProps) {
  return (
    <Stack
      role="alert"
      align="center"
      textAlign="center"
      gap="0.5rem"
      py="1.5rem"
      {...rest}
    >
      <Center boxSize="2.5rem" borderRadius="full" bg="error.50" mb="0.25rem">
        <WarningCircle boxSize="1.25rem" color="error.300" />
      </Center>
      <Text textStyle="small-semibold" color="gray.500">
        {title}
      </Text>
      <Text textStyle="small-regular" color="gray.300" maxW="24rem">
        {getErrorMessage(error) || "Something went wrong. Please try again."}
      </Text>
      <Button
        variant="outlineSecondary"
        size="md"
        mt="0.25rem"
        onClick={onRetry}
        loading={isRetrying}
        loadingText="Retrying"
      >
        <ArrowClockwise boxSize="1rem" />
        Try again
      </Button>
    </Stack>
  );
}
