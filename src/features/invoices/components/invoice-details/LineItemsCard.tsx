import { Box, Flex, Stack, Table, Text } from "@chakra-ui/react";
import { SectionCard } from "@/components/ui";
import type { IPortalInvoiceDetail } from "@/shared/interface/portal";
import { formatMoney } from "@/utils/format-money";

function TotalRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <Flex
      justify="space-between"
      gap="1rem"
      py="0.25rem"
      borderTopWidth={strong ? "1px" : 0}
      borderColor="gray.75"
      pt={strong ? "0.625rem" : "0.25rem"}
      mt={strong ? "0.375rem" : 0}
    >
      <Text
        textStyle={strong ? "small-semibold" : "small-regular"}
        color={strong ? "gray.500" : "gray.300"}
      >
        {label}
      </Text>
      <Text
        textStyle={strong ? "default-semibold" : "small-medium"}
        color="gray.500"
        fontVariantNumeric="tabular-nums"
      >
        {value}
      </Text>
    </Flex>
  );
}

export function LineItemsCard({ invoice }: { invoice: IPortalInvoiceDetail }) {
  const money = (value?: number | null) =>
    formatMoney(value ?? 0, invoice.currency_code);
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = Number(invoice.tax_value ?? 0);
  const discount = Math.max(
    0,
    subtotal + tax - Number(invoice.total_price ?? 0),
  );

  return (
    <SectionCard title="Items">
      <Box display={{ base: "none", md: "block" }}>
        <Table.Root
          size="sm"
          css={{ "& td, & th": { borderColor: "gray.50" } }}
        >
          <Table.Header>
            <Table.Row>
              {["Item", "Qty", "Price", "Amount"].map((h, i) => (
                <Table.ColumnHeader
                  key={h}
                  px="0"
                  pb="0.5rem"
                  textStyle="tiny-semibold"
                  color="gray.300"
                  textTransform="uppercase"
                  textAlign={i === 0 ? "start" : "end"}
                >
                  {h}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {invoice.items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell px="0" py="0.75rem" pr="1rem">
                  <Text textStyle="small-medium" color="gray.500">
                    {item.product_name}
                  </Text>
                  {item.description && (
                    <Text textStyle="tiny-regular" color="gray.300">
                      {item.description}
                    </Text>
                  )}
                </Table.Cell>
                {[
                  String(item.quantity),
                  money(item.price),
                  money(item.price * item.quantity),
                ].map((value, i) => (
                  <Table.Cell
                    key={i}
                    px="0"
                    pl="1rem"
                    textAlign="end"
                    textStyle="small-regular"
                    color="gray.500"
                    fontVariantNumeric="tabular-nums"
                    whiteSpace="nowrap"
                  >
                    {value}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      <Stack
        as="ul"
        display={{ base: "flex", md: "none" }}
        gap="0"
        listStyleType="none"
        m="0"
        p="0"
      >
        {invoice.items.map((item) => (
          <Flex
            as="li"
            key={item.id}
            justify="space-between"
            gap="1rem"
            py="0.75rem"
            borderBottomWidth="1px"
            borderColor="gray.50"
          >
            <Box minW={0}>
              <Text
                textStyle="small-medium"
                color="gray.500"
                wordBreak="break-word"
              >
                {item.product_name}
              </Text>
              <Text
                textStyle="tiny-regular"
                color="gray.300"
                fontVariantNumeric="tabular-nums"
              >
                {item.quantity} × {money(item.price)}
              </Text>
            </Box>
            <Text
              textStyle="small-medium"
              color="gray.500"
              fontVariantNumeric="tabular-nums"
              flexShrink={0}
            >
              {money(item.price * item.quantity)}
            </Text>
          </Flex>
        ))}
      </Stack>

      <Box ml="auto" maxW={{ base: "100%", md: "18rem" }} mt="1rem">
        <TotalRow label="Subtotal" value={money(subtotal)} />
        {discount > 0.004 && (
          <TotalRow label="Discount" value={`-${money(discount)}`} />
        )}
        {tax > 0 && <TotalRow label="Tax" value={money(tax)} />}
        <TotalRow label="Total" value={money(invoice.total_price)} />
        <TotalRow label="Paid" value={money(invoice.amount_paid)} />
        <TotalRow label="Amount due" value={money(invoice.amount_due)} strong />
      </Box>

      {invoice.memo && (
        <Box mt="1rem" bg="gray.25" borderRadius="0.5rem" p="0.75rem">
          <Text
            textStyle="tiny-semibold"
            color="gray.300"
            textTransform="uppercase"
          >
            Note from your practice
          </Text>
          <Text textStyle="small-regular" color="gray.400" mt="0.25rem">
            {invoice.memo}
          </Text>
        </Box>
      )}
    </SectionCard>
  );
}
