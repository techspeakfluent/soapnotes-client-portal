import { createListCollection, Portal, Select } from "@chakra-ui/react";
import { useMemo } from "react";

interface CustomSelectProps {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  width?: object | string;
}

export function CustomSelect({
  label,
  value,
  options,
  onChange,
  width = { base: "100%", md: "13rem" },
}: CustomSelectProps) {
  const collection = useMemo(
    () => createListCollection({ items: options }),
    [options],
  );

  return (
    <Select.Root
      collection={collection}
      value={[value]}
      onValueChange={(e) => onChange(e.value[0] ?? "")}
      w={width}
      positioning={{ sameWidth: true }}
    >
      <Select.HiddenSelect aria-label={label} />
      <Select.Control w="100%">
        <Select.Trigger
          aria-label={label}
          pl="1rem"
          h="2.5rem"
          rounded=".625rem"
          border="1px solid"
          borderColor="gray.75"
          bg="white"
        >
          <Select.ValueText textStyle="tiny-regular" color="gray.500" />
        </Select.Trigger>
        <Select.IndicatorGroup pr=".85rem">
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content bg="white">
            {collection.items.map((option) => (
              <Select.Item
                key={option.value || "all"}
                item={option}
                px=".5rem"
                py=".5rem"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
