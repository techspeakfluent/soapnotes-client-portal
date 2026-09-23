import { Box, Input, InputGroup } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@/components/icons";

interface SearchInputProps {
  value: string;
  onSearch: (value: string) => void;
  label: string;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchInput({
  value,
  onSearch,
  label,
  placeholder,
  debounceMs = 350,
}: SearchInputProps) {
  const [draft, setDraft] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Follow outside changes (e.g. "Clear filters").
  useEffect(() => setDraft(value), [value]);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <Box w={{ base: "100%", md: "18rem" }}>
      <InputGroup
        startElement={<MagnifyingGlassIcon w="1.19rem" color="gray.200" />}
      >
        <Input
          type="search"
          aria-label={label}
          placeholder={placeholder ?? label}
          value={draft}
          h="2.5rem"
          bg="white"
          color="gray.300"
          borderColor="gray.50 !important"
          boxShadow="none !important"
          _focus={{ borderColor: "primary.50 !important" }}
          _placeholder={{ color: "gray.200", fontSize: "0.75rem" }}
          onChange={(e) => {
            const next = e.target.value;
            setDraft(next);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => onSearch(next.trim()), debounceMs);
          }}
        />
      </InputGroup>
    </Box>
  );
}
