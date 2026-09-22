import { Center, Spinner, type CenterProps } from "@chakra-ui/react";

export function SectionLoader(props: CenterProps) {
  return (
    <Center h="25rem" p="1.125rem" bg="inherit" rounded=".75rem" {...props}>
      <Spinner size="xl" />
    </Center>
  );
}
