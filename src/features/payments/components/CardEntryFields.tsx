import { Field, Flex, Input, SimpleGrid, Text } from "@chakra-ui/react";
import { Lock } from "@/components/icons";
import {
  formatCardNumber,
  formatExpiryInput,
  type CardEntry,
} from "../hooks/useCardEntry";

const inputProps = { bg: "white" } as const;

export function CardEntryFields({ entry }: { entry: CardEntry }) {
  const { values, errors, setField } = entry;

  return (
    <Flex direction="column" gap="0.75rem">
      <Field.Root invalid={!!errors.number}>
        <Field.Label textStyle="small-medium" color="gray.400">
          Card number
        </Field.Label>
        <Input
          {...inputProps}
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 1234 1234 1234"
          value={values.number}
          onChange={(e) => setField("number", formatCardNumber(e.target.value))}
        />
        <Field.ErrorText>{errors.number}</Field.ErrorText>
      </Field.Root>
      <SimpleGrid columns={2} gap="0.75rem">
        <Field.Root invalid={!!errors.expiry}>
          <Field.Label textStyle="small-medium" color="gray.400">
            Expiry
          </Field.Label>
          <Input
            {...inputProps}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={values.expiry}
            onChange={(e) =>
              setField("expiry", formatExpiryInput(e.target.value))
            }
          />
          <Field.ErrorText>{errors.expiry}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!errors.cvc}>
          <Field.Label textStyle="small-medium" color="gray.400">
            Security code
          </Field.Label>
          <Input
            {...inputProps}
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="CVC"
            value={values.cvc}
            onChange={(e) =>
              setField("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))
            }
          />
          <Field.ErrorText>{errors.cvc}</Field.ErrorText>
        </Field.Root>
      </SimpleGrid>
      <Flex align="center" gap="0.375rem" color="gray.300">
        <Lock boxSize="0.875rem" aria-hidden />
        <Text textStyle="tiny-regular">
          Your card details are encrypted and handled by our payment processor.
        </Text>
      </Flex>
    </Flex>
  );
}
