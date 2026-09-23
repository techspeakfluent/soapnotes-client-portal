import { Button, Center, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, SignIn } from "@/components/icons";
import { setAccessToken } from "@/lib/storage";
import { DEMO_ACCESS_TOKEN, demoSignInEnabled } from "@/mocks/config";
import { RouteConstants } from "@/shared/constants/routes";

// Only same-app paths, so `?next=` can't send anyone off-site.
const safeNext = (next: string | null) =>
  next && next.startsWith("/") && !next.startsWith("//")
    ? next
    : RouteConstants.dashboard.home.path;

export function SignInTemplate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const continueAsDemo = () => {
    setAccessToken(DEMO_ACCESS_TOKEN);
    navigate(safeNext(params.get("next")), { replace: true });
  };

  return (
    <Center minH="100dvh" bg="gray.50" px="1rem" py="2rem">
      <Stack
        as="main"
        bg="white"
        borderWidth="1px"
        borderColor="gray.50"
        borderRadius="0.75rem"
        p={{ base: "1.5rem", md: "2rem" }}
        gap="1rem"
        w="100%"
        maxW="26rem"
        textAlign="center"
        align="center"
      >
        <Center boxSize="3rem" borderRadius="full" bg="primary.50">
          <Lock boxSize="1.5rem" color="primary.400" />
        </Center>
        <Heading as="h1" textStyle="h2-semibold" color="gray.500">
          You're signed out
        </Heading>
        <Text textStyle="small-regular" color="gray.300">
          Open the portal link from your practice to sign in again and see your
          sessions, invoices and payments.
        </Text>
        {demoSignInEnabled && (
          <Button variant="primary" w="100%" onClick={continueAsDemo}>
            <SignIn boxSize="1.125rem" />
            Continue with demo account
          </Button>
        )}
      </Stack>
    </Center>
  );
}
