import { Box, Flex, Skeleton, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ActionMenu } from "./ActionMenu";
import type { TableAction } from "./types";

interface ListCardField {
  label: string;
  value: ReactNode;
}

interface ListCardProps<T> {
  row: T;
  title: ReactNode;
  badge?: ReactNode;
  highlight?: ReactNode;
  highlightLabel?: string;
  fields?: ListCardField[];
  footer?: ReactNode;
  actions?: TableAction<T>[];
  actionsLabel?: string;
  to?: string;
}

export function ListCard<T>({
  row,
  title,
  badge,
  highlight,
  highlightLabel,
  fields = [],
  footer,
  actions,
  actionsLabel = "row",
  to,
}: ListCardProps<T>) {
  return (
    <Box
      position="relative"
      bg="white"
      borderWidth="1px"
      borderColor="gray.50"
      borderRadius="0.75rem"
      p="1rem"
      minW={0}
      _hover={to ? { borderColor: "primary.100" } : undefined}
      transition="border-color 0.15s"
    >
      <Flex align="flex-start" gap="0.5rem">
        <Stack gap="0.375rem" flex="1" minW={0}>
          <Flex align="center" gap="0.5rem" wrap="wrap" minW={0}>
            <Text
              textStyle="small-semibold"
              color="gray.500"
              minW={0}
              wordBreak="break-word"
              css={{
                "& a::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  borderRadius: "0.75rem",
                },
                "& a:focus-visible": { outline: "none" },
                "& a:focus-visible::after": {
                  outline: "2px solid {colors.primary.300}",
                  outlineOffset: "2px",
                },
              }}
            >
              {to ? (
                // Stretched link: the whole card is clickable, but it's one real link.
                <Link to={to}>{title}</Link>
              ) : (
                title
              )}
            </Text>
            {badge}
          </Flex>
          {highlight !== undefined && (
            <Box>
              {highlightLabel && (
                <Text textStyle="tiny-regular" color="gray.300">
                  {highlightLabel}
                </Text>
              )}
              <Text
                textStyle="large-semibold"
                color="gray.500"
                fontVariantNumeric="tabular-nums"
              >
                {highlight}
              </Text>
            </Box>
          )}
        </Stack>
        {actions && actions.length > 0 && (
          // Above the stretched link so the menu stays clickable.
          <Box position="relative" zIndex={1} mt="-0.5rem" mr="-0.5rem">
            <ActionMenu row={row} actions={actions} label={actionsLabel} />
          </Box>
        )}
      </Flex>

      {fields.length > 0 && (
        <Stack as="dl" gap="0.25rem" my="0" pt="0.75rem">
          {fields.map((field) => (
            <Flex key={field.label} justify="space-between" gap="1rem" minW={0}>
              <Text
                as="dt"
                textStyle="tiny-regular"
                color="gray.300"
                flexShrink={0}
              >
                {field.label}
              </Text>
              <Text
                as="dd"
                m="0"
                textStyle="tiny-medium"
                color="gray.400"
                textAlign="end"
                minW={0}
                wordBreak="break-word"
                fontVariantNumeric="tabular-nums"
              >
                {field.value}
              </Text>
            </Flex>
          ))}
        </Stack>
      )}
      {footer && (
        <Box mt="0.75rem" position="relative" zIndex={1}>
          {footer}
        </Box>
      )}
    </Box>
  );
}

export function ListCardSkeleton() {
  return (
    <Stack
      bg="white"
      borderWidth="1px"
      borderColor="gray.50"
      borderRadius="0.75rem"
      p="1rem"
      gap="0.625rem"
    >
      <Skeleton h="1rem" w="55%" />
      <Skeleton h="1.5rem" w="35%" />
      <Skeleton h="0.75rem" w="100%" />
      <Skeleton h="0.75rem" w="80%" />
    </Stack>
  );
}
