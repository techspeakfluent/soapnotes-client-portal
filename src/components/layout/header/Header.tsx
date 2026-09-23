import {
  Box,
  Flex,
  IconButton,
  Menu,
  Portal,
  Skeleton,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { CaretDown, Hamburger, SignOutIcon, User } from "@/components/icons";
import { PersonAvatar, PracticeLogo } from "@/components/ui";
import { useGetMe } from "@/features/client/api/query";
import { removeToken } from "@/lib/storage";
import { RouteConstants } from "@/shared/constants/routes";
import { getFullName, getPrimaryEmail } from "@/utils/client";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { data, isPending } = useGetMe();
  const client = data?.data;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fullName = getFullName(client);
  const email = getPrimaryEmail(client);

  const signOut = () => {
    removeToken();
    // Nothing of this client's may survive into the next session.
    queryClient.clear();
    navigate(RouteConstants.auth.signIn.path, { replace: true });
  };

  return (
    <Flex
      as="header"
      align="center"
      h="4rem"
      px={{ base: "1rem", md: "1.5rem" }}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.50"
      gap="0.75rem"
      flexShrink={0}
    >
      <IconButton
        display={{ base: "inline-flex", lg: "none" }}
        aria-label="Open menu"
        variant="outlineSecondary"
        boxSize="2.5rem"
        minW="2.5rem"
        flexShrink={0}
        onClick={onMenuToggle}
      >
        <Hamburger w="1.25rem" color="gray.400" />
      </IconButton>

      <Flex
        display={{ base: "flex", lg: "none" }}
        align="center"
        gap="0.5rem"
        minW={0}
        flex="1"
      >
        {client && (
          <>
            <PracticeLogo organization={client.organization} />
            <Text
              textStyle="small-semibold"
              color="gray.500"
              truncate
              display={{ base: "none", sm: "block" }}
            >
              {client.organization.name}
            </Text>
          </>
        )}
      </Flex>

      <Flex align="center" ml="auto" flexShrink={0}>
        {isPending ? (
          <Flex align="center" gap="0.75rem">
            <Skeleton
              h="1rem"
              w="8rem"
              display={{ base: "none", md: "block" }}
            />
            <SkeletonCircle size="2rem" />
          </Flex>
        ) : client ? (
          <Menu.Root positioning={{ placement: "bottom-end" }}>
            <Menu.Trigger asChild>
              <Flex
                as="button"
                align="center"
                gap="0.5rem"
                px="0.5rem"
                borderRadius="0.5rem"
                cursor="pointer"
                _hover={{ bg: "gray.25" }}
                transition="background-color 0.15s"
                aria-label={`Account menu for ${fullName}`}
              >
                <Text
                  textStyle="small-medium"
                  color="gray.400"
                  maxW="16rem"
                  truncate
                  display={{ base: "none", md: "block" }}
                >
                  {fullName}
                </Text>
                <PersonAvatar name={fullName} />
                <CaretDown w="0.75rem" color="gray.300" aria-hidden />
              </Flex>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="14rem" maxW="calc(100vw - 2rem)">
                  <Box px="0.75rem" py="0.5rem" minW={0}>
                    <Text textStyle="small-semibold" color="gray.500" truncate>
                      {fullName}
                    </Text>
                    <Text textStyle="tiny-regular" color="gray.300" truncate>
                      {email}
                    </Text>
                  </Box>
                  <Menu.Separator borderColor="gray.50" />
                  <Menu.Item
                    value="profile"
                    gap="0.5rem"
                    cursor="pointer"
                    onSelect={() => navigate(RouteConstants.profile.base.path)}
                  >
                    <User w="1rem" />
                    Profile
                  </Menu.Item>
                  <Menu.Item
                    value="sign-out"
                    gap="0.5rem"
                    color="error.300"
                    cursor="pointer"
                    onSelect={signOut}
                  >
                    <SignOutIcon w="1rem" />
                    Sign out
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        ) : null}
      </Flex>
    </Flex>
  );
}
