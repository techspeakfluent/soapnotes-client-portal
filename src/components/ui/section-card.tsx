import { Box, Flex, Heading, Text, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface SectionCardProps extends Omit<BoxProps, "title"> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  bodyProps?: BoxProps;
  footer?: ReactNode;
  children: ReactNode;
}

const CARD_PADDING = { base: "1rem", md: "1.5rem" };

export function SectionCard({
  title,
  subtitle,
  action,
  bodyProps,
  footer,
  children,
  ...rest
}: SectionCardProps) {
  return (
    <Box
      as="section"
      bg="white"
      borderRadius="0.75rem"
      borderWidth="1px"
      borderColor="gray.50"
      overflow="hidden"
      minW={0}
      {...rest}
    >
      {(title || action) && (
        <Flex
          px={CARD_PADDING}
          pt={CARD_PADDING}
          alignItems="center"
          justifyContent="space-between"
          gap="0.75rem"
        >
          <Box minW={0}>
            {title && (
              <Heading as="h2" textStyle="h4-semibold" color="gray.500">
                {title}
              </Heading>
            )}
            {subtitle && (
              <Text textStyle="small-regular" color="gray.300" mt="0.125rem">
                {subtitle}
              </Text>
            )}
          </Box>
          {action}
        </Flex>
      )}
      <Box p={CARD_PADDING} {...bodyProps}>
        {children}
      </Box>
      {footer && (
        <Box
          px={CARD_PADDING}
          py="0.75rem"
          borderTopWidth="1px"
          borderColor="gray.50"
        >
          {footer}
        </Box>
      )}
    </Box>
  );
}
