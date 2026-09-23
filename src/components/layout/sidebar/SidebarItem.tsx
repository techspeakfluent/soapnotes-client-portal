import { Box, Flex, Text } from "@chakra-ui/react";
import { NavLink, useMatch } from "react-router-dom";
import type { SidebarItem as SidebarItemType } from "./sidebar-config";

export default function SidebarItem({ item }: { item: SidebarItemType }) {
  const isActive = !!useMatch({ path: item.path, end: !!item.end });

  return (
    <Flex
      asChild
      alignItems="center"
      gap="0.75rem"
      w="full"
      py="0.5rem"
      px="0.75rem"
      borderRadius="0.5rem"
      textStyle="small-medium"
      color={isActive ? "white" : "gray.300"}
      bg={isActive ? "primary.300" : "transparent"}
      _hover={{ bg: isActive ? "primary.300" : "gray.50" }}
      transition="background-color 0.15s, color 0.15s"
    >
      <NavLink to={item.path} end={item.end}>
        <Box flexShrink={0} w="1.25rem" color="inherit" aria-hidden>
          {item.icon}
        </Box>
        <Text flex="1" truncate>
          {item.label}
        </Text>
      </NavLink>
    </Flex>
  );
}
