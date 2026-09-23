import { Box, Flex, Skeleton, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { PracticeLogo } from "@/components/ui";
import { useGetMe } from "@/features/client/api/query";
import SidebarItemComponent from "./SidebarItem";
import { sidebarItems } from "./sidebar-config";

export default function Sidebar({
  headerAction,
}: {
  headerAction?: ReactNode;
}) {
  const { data } = useGetMe();
  const organization = data?.data.organization;

  return (
    <Flex
      direction="column"
      w="16rem"
      minW="16rem"
      h="100dvh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.50"
    >
      <Flex
        align="center"
        gap="0.75rem"
        px="1.25rem"
        h="4rem"
        flexShrink={0}
        borderBottom="1px solid"
        borderColor="gray.50"
      >
        {organization ? (
          <>
            <PracticeLogo organization={organization} />
            <Text
              flex="1"
              minW={0}
              textStyle="small-semibold"
              color="gray.500"
              lineClamp={2}
            >
              {organization.name}
            </Text>
          </>
        ) : (
          <Skeleton h="2.25rem" flex="1" borderRadius="0.5rem" />
        )}
        {headerAction && <Box flexShrink={0}>{headerAction}</Box>}
      </Flex>

      <Stack
        as="nav"
        aria-label="Main"
        gap="0.25rem"
        flex="1"
        overflowY="auto"
        px="0.75rem"
        py="1rem"
      >
        {sidebarItems.map((item) => (
          <SidebarItemComponent key={item.path} item={item} />
        ))}
      </Stack>
    </Flex>
  );
}
