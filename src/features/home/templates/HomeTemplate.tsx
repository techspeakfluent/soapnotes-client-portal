import { Button, Center, Heading, Stack, Text } from "@chakra-ui/react";

// Placeholder until the first real screen lands; confirms the theme is wired.
export function HomeTemplate() {
  return (
    <Center minH="100dvh" bg="gray.25" p="1rem">
      <Stack gap="1rem" align="center" textAlign="center" maxW="28rem">
        <Heading size="2xl" color="gray.800">
          Soap Notes Client Portal
        </Heading>
        <Text textStyle="default-regular" color="gray.300">
          Your sessions, invoices and forms, in one place.
        </Text>
        <Button bg="primary.500" color="white" _hover={{ bg: "primary.600" }}>
          Coming soon
        </Button>
      </Stack>
    </Center>
  );
}
