import { Field, Input, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState, type FormEvent } from "react";
import { CustomModal } from "@/components/ui";
import type {
  IPortalClient,
  IUpdateProfilePayload,
} from "@/shared/interface/portal";
import { useUpdateProfile } from "../api/query";

type FormValues = Record<keyof Required<IUpdateProfilePayload>, string>;

const toForm = (client: IPortalClient): FormValues => ({
  first_name: client.first_name ?? "",
  middle_name: client.middle_name ?? "",
  last_name: client.last_name ?? "",
  display_name: client.display_name ?? "",
  phone: client.phone ?? "",
  dob: client.dob ? client.dob.slice(0, 10) : "",
  address: client.address ?? "",
  city: client.city ?? "",
  state: client.state ?? "",
  postal_code: client.postal_code ?? "",
  country: client.country ?? "",
});

const validate = (values: FormValues) => {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (!values.first_name.trim()) errors.first_name = "Enter your first name.";
  if (!values.last_name.trim()) errors.last_name = "Enter your last name.";
  if (values.phone && values.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter a full phone number.";
  }
  if (values.dob && new Date(values.dob) > new Date()) {
    errors.dob = "Date of birth can't be in the future.";
  }
  return errors;
};

interface FieldDef {
  name: keyof FormValues;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  helper?: string;
}

const PERSONAL: FieldDef[] = [
  {
    name: "first_name",
    label: "First name",
    autoComplete: "given-name",
    required: true,
  },
  {
    name: "middle_name",
    label: "Middle name",
    autoComplete: "additional-name",
  },
  {
    name: "last_name",
    label: "Last name",
    autoComplete: "family-name",
    required: true,
  },
  {
    name: "display_name",
    label: "Preferred name",
    autoComplete: "nickname",
    helper: "What your practice calls you. Leave blank to use your full name.",
  },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "dob", label: "Date of birth", type: "date", autoComplete: "bday" },
];

const ADDRESS: FieldDef[] = [
  { name: "address", label: "Street address", autoComplete: "street-address" },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "state", label: "Province or state", autoComplete: "address-level1" },
  { name: "postal_code", label: "Postal code", autoComplete: "postal-code" },
  { name: "country", label: "Country", autoComplete: "country-name" },
];

const FORM_ID = "edit-details-form";

export function EditDetailsDialog({
  client,
  open,
  onClose,
}: {
  client: IPortalClient;
  open: boolean;
  onClose: () => void;
}) {
  const update = useUpdateProfile();
  const [values, setValues] = useState(() => toForm(client));
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});

  useEffect(() => {
    if (open) {
      setValues(toForm(client));
      setErrors({});
    }
  }, [open, client]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const trimmed = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim() || null]),
    ) as IUpdateProfilePayload;
    trimmed.first_name = values.first_name.trim();
    trimmed.last_name = values.last_name.trim();
    trimmed.display_name =
      values.display_name.trim() ||
      `${trimmed.first_name} ${trimmed.last_name}`;
    update.mutate(trimmed, { onSuccess: onClose });
  };

  const renderField = (field: FieldDef) => (
    <Field.Root
      key={field.name}
      invalid={!!errors[field.name]}
      required={field.required}
    >
      <Field.Label textStyle="small-medium" color="gray.400">
        {field.label}
        {field.required && <Field.RequiredIndicator />}
      </Field.Label>
      <Input
        name={field.name}
        type={field.type ?? "text"}
        autoComplete={field.autoComplete}
        value={values[field.name]}
        max={
          field.type === "date"
            ? new Date().toISOString().slice(0, 10)
            : undefined
        }
        onChange={(e) => {
          const value = e.target.value;
          setValues((prev) => ({ ...prev, [field.name]: value }));
          if (errors[field.name])
            setErrors((prev) => ({ ...prev, [field.name]: undefined }));
        }}
      />
      {field.helper && !errors[field.name] && (
        <Field.HelperText textStyle="tiny-regular" color="gray.300">
          {field.helper}
        </Field.HelperText>
      )}
      <Field.ErrorText>{errors[field.name]}</Field.ErrorText>
    </Field.Root>
  );

  return (
    <CustomModal
      open={open}
      onClose={() => !update.isPending && onClose()}
      title="Edit your details"
      description="Your practice sees these on your file."
      size="lg"
      secondaryAction={{
        text: "Cancel",
        onClick: onClose,
        disabled: update.isPending,
      }}
      primaryAction={{
        text: "Save changes",
        type: "submit",
        form: FORM_ID,
        loading: update.isPending,
        loadingText: "Saving",
      }}
    >
      <Stack asChild gap="1.25rem">
        <form id={FORM_ID} onSubmit={submit} noValidate>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="1rem">
            {PERSONAL.map(renderField)}
          </SimpleGrid>
          <Text textStyle="small-semibold" color="gray.500" pt="0.5rem">
            Address
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="1rem">
            {ADDRESS.map(renderField)}
          </SimpleGrid>
        </form>
      </Stack>
    </CustomModal>
  );
}
