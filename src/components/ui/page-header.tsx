import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      alignItems={{ base: "stretch", md: "flex-end" }}
      justifyContent="space-between"
      gap="0.75rem"
    >
      <Box minW={0}>
        <Heading
          as="h1"
          textStyle={{ base: "h2-semibold", md: "h1-semibold" }}
          color="gray.500"
        >
          {title}
        </Heading>
        {description && (
          <Text textStyle="small-regular" color="gray.300" mt="0.25rem">
            {description}
          </Text>
        )}
      </Box>
      {children}
    </Flex>
  );
}
