import { Box, Flex, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { PersonAvatar } from "@/components/ui";
import { useCurrentClient } from "@/features/client/hooks/useCurrentClient";
import { getFullName, getPrimaryEmail } from "@/utils/client";
import { DetailsCard } from "../components/DetailsCard";
import { EmailsCard } from "../components/EmailsCard";
import { NotificationsCard } from "../components/NotificationsCard";
import { RecentActivityCard } from "../components/RecentActivityCard";

export function ProfileTemplate() {
  const client = useCurrentClient();
  const name = getFullName(client);

  return (
    <Stack gap={{ base: "1rem", md: "1.5rem" }}>
      <Flex align="center" gap="1rem" minW={0}>
        <PersonAvatar name={name} size="2xl" />
        <Box minW={0}>
          <Heading
            as="h1"
            textStyle={{ base: "h2-semibold", md: "h1-semibold" }}
            color="gray.500"
            wordBreak="break-word"
          >
            {name}
          </Heading>
          <Text
            textStyle="small-regular"
            color="gray.300"
            wordBreak="break-all"
          >
            {getPrimaryEmail(client)}
          </Text>
        </Box>
      </Flex>

      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          lg: "minmax(0, 3fr) minmax(0, 2fr)",
        }}
        gap="1rem"
        alignItems="start"
      >
        <Stack gap="1rem" minW={0}>
          <DetailsCard client={client} />
          <EmailsCard client={client} />
          <NotificationsCard />
        </Stack>
        <RecentActivityCard />
      </Grid>
    </Stack>
  );
}
