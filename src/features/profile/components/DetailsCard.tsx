import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { PencilSimpleIcon } from "@/components/icons";
import { SectionCard } from "@/components/ui";
import type { IPortalClient } from "@/shared/interface/portal";
import { getFullName } from "@/utils/client";
import { formatDate } from "@/utils/format-date";
import { EditDetailsDialog } from "./EditDetailsDialog";

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <Flex
      as="div"
      direction={{ base: "column", sm: "row" }}
      justify="space-between"
      gap={{ base: "0.125rem", sm: "1rem" }}
      py="0.625rem"
      borderTopWidth="1px"
      borderColor="gray.50"
      _first={{ borderTopWidth: 0, pt: 0 }}
    >
      <Text as="dt" textStyle="small-regular" color="gray.300" flexShrink={0}>
        {label}
      </Text>
      <Text
        as="dd"
        m="0"
        textStyle="small-medium"
        color={value ? "gray.500" : "gray.200"}
        textAlign={{ base: "start", sm: "end" }}
        wordBreak="break-word"
        minW={0}
      >
        {value || "Not added"}
      </Text>
    </Flex>
  );
}

export function DetailsCard({ client }: { client: IPortalClient }) {
  const [editing, setEditing] = useState(false);
  const fullName = [client.first_name, client.middle_name, client.last_name]
    .filter(Boolean)
    .join(" ");
  const address = [
    client.address,
    client.city,
    client.state,
    client.postal_code,
    client.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <SectionCard
      title="Personal details"
      action={
        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
          <PencilSimpleIcon boxSize="0.875rem" />
          Edit
        </Button>
      }
    >
      <Stack as="dl" gap="0" my="0">
        <DetailRow label="Full name" value={fullName || getFullName(client)} />
        <DetailRow label="Preferred name" value={client.display_name} />
        <DetailRow label="Phone" value={client.phone} />
        <DetailRow
          label="Date of birth"
          value={client.dob ? formatDate(client.dob) : null}
        />
        <DetailRow label="Address" value={address} />
      </Stack>
      <Box>
        <EditDetailsDialog
          client={client}
          open={editing}
          onClose={() => setEditing(false)}
        />
      </Box>
    </SectionCard>
  );
}
