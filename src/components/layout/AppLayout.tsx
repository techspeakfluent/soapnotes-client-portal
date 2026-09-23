import { Box, Flex, Skeleton, Stack } from "@chakra-ui/react";
import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { ErrorState } from "@/components/ui";
import { useGetMe } from "@/features/client/api/query";
import { CurrentClientContext } from "@/features/client/hooks/useCurrentClient";
import Header from "./header/Header";
import MobileSidebar from "./sidebar/MobileSidebar";
import Sidebar from "./sidebar/Sidebar";

function PageSkeleton() {
  return (
    <Stack gap="1rem" aria-busy="true" aria-label="Loading">
      <Skeleton h="2.25rem" w="14rem" />
      <Skeleton h="1rem" w="20rem" maxW="100%" />
      <Skeleton h="8rem" borderRadius="0.75rem" mt="0.5rem" />
      <Skeleton h="12rem" borderRadius="0.75rem" />
    </Stack>
  );
}

function ClientGate() {
  const { data, error, isPending, refetch, isRefetching } = useGetMe();

  if (isPending) return <PageSkeleton />;
  if (error || !data) {
    return (
      <ErrorState
        error={error}
        title="We couldn't load your account"
        onRetry={() => refetch()}
        isRetrying={isRefetching}
        py="4rem"
      />
    );
  }

  return (
    <CurrentClientContext.Provider value={data.data}>
      <Suspense fallback={<PageSkeleton />}>
        <Outlet />
      </Suspense>
    </CurrentClientContext.Provider>
  );
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Flex h="100dvh" overflow="hidden" bg="gray.50">
      <Box display={{ base: "none", lg: "block" }}>
        <Sidebar />
      </Box>

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Flex direction="column" flex="1" minW="0">
        <Header onMenuToggle={() => setMobileOpen(true)} />

        <Box
          as="main"
          flex="1"
          overflowY="auto"
          css={{ overscrollBehaviorY: "contain" }}
          px={{ base: "1rem", md: "1.5rem" }}
          pt={{ base: "1rem", md: "1.5rem" }}
          // Clears the iPhone home bar when the page scrolls to its end.
          pb="calc(2rem + env(safe-area-inset-bottom))"
        >
          <Box maxW="75rem" mx="auto" minW={0}>
            <ClientGate />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
