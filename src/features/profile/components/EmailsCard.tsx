import { Button, Field, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle, Envelope, PlusIcon, TrashIcon } from "@/components/icons";
import { ActionMenu, type TableAction } from "@/components/table";
import {
  CustomModal,
  ConfirmDialog,
  SectionCard,
  StatusChip,
} from "@/components/ui";
import type { IClientEmail } from "@/shared/interface/common";
import type { IPortalClient } from "@/shared/interface/portal";
import { useAddEmail, useRemoveEmail, useSetPrimaryEmail } from "../api/query";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORM_ID = "add-email-form";

function AddEmailDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const add = useAddEmail();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter an email address like name@example.com.");
      return;
    }
    add.mutate(email.trim(), {
      onSuccess: () => {
        setEmail("");
        onClose();
      },
    });
  };

  return (
    <CustomModal
      open={open}
      onClose={() => !add.isPending && onClose()}
      title="Add an email"
      description="Your practice can reach you at any of your emails. Invoices and reminders go to your primary one."
      size="sm"
      secondaryAction={{
        text: "Cancel",
        onClick: onClose,
        disabled: add.isPending,
      }}
      primaryAction={{
        text: "Add email",
        type: "submit",
        form: FORM_ID,
        loading: add.isPending,
      }}
    >
      <form id={FORM_ID} onSubmit={submit} noValidate>
        <Field.Root invalid={!!error}>
          <Field.Label textStyle="small-medium" color="gray.400">
            Email address
          </Field.Label>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
          <Field.ErrorText>{error}</Field.ErrorText>
        </Field.Root>
      </form>
    </CustomModal>
  );
}

export function EmailsCard({ client }: { client: IPortalClient }) {
  const setPrimary = useSetPrimaryEmail();
  const remove = useRemoveEmail();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<IClientEmail | null>(null);

  const emails = useMemo(
    () =>
      [...client.client_emails].sort(
        (a, b) => Number(!!b.is_primary_email) - Number(!!a.is_primary_email),
      ),
    [client.client_emails],
  );

  const actions = useMemo<TableAction<IClientEmail>[]>(
    () => [
      {
        label: "Make primary",
        value: "primary",
        icon: <CheckCircle boxSize="1rem" />,
        onClick: (email) =>
          setPrimary.mutateAsync(email.id!).then(() => undefined),
      },
      {
        label: "Remove",
        value: "remove",
        icon: <TrashIcon boxSize="1rem" />,
        variant: "destructive",
        onClick: (email) => setRemoving(email),
      },
    ],
    [setPrimary],
  );

  return (
    <SectionCard
      title="Email addresses"
      subtitle="Invoices and reminders go to your primary email."
      action={
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          <PlusIcon boxSize="0.875rem" />
          Add
        </Button>
      }
    >
      <Stack as="ul" gap="0" listStyleType="none" m="0" p="0">
        {emails.map((email, i) => (
          <Flex
            as="li"
            key={email.id ?? email.email}
            align="center"
            gap="0.75rem"
            py="0.5rem"
            minH="3.25rem"
            borderTopWidth={i === 0 ? 0 : "1px"}
            borderColor="gray.50"
          >
            <Envelope
              boxSize="1rem"
              color="gray.200"
              flexShrink={0}
              aria-hidden
            />
            <Flex flex="1" minW={0} align="center" gap="0.5rem" wrap="wrap">
              <Text
                textStyle="small-medium"
                color="gray.500"
                wordBreak="break-all"
                minW={0}
              >
                {email.email}
              </Text>
              {email.is_primary_email && (
                <StatusChip tone="success" label="Primary" />
              )}
            </Flex>
            {!email.is_primary_email && email.id && (
              <ActionMenu row={email} actions={actions} label={email.email} />
            )}
          </Flex>
        ))}
      </Stack>

      <AddEmailDialog open={adding} onClose={() => setAdding(false)} />
      <ConfirmDialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        title="Remove this email?"
        description={
          removing
            ? `${removing.email} will be removed from your account, and your practice won't be able to reach you there.`
            : ""
        }
        confirmLabel="Remove email"
        isPending={remove.isPending}
        onConfirm={() =>
          removing?.id &&
          remove.mutate(removing.id, { onSuccess: () => setRemoving(null) })
        }
      />
    </SectionCard>
  );
}
